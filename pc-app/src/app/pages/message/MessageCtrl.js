/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.message')
    .controller('MessageCtrl', MessageCtrl);

  /** @ngInject */
  function MessageCtrl($stateParams, $scope, $resUser, $Imchat, localStorageService, $time, $location, $anchorScroll, $uibModal, $SchoolClass, $Schedule, 
    $Teacher, $Parent, $Student, MultipleViewsManager, $Error, toastr,$pouchDb) {
    $scope.user = localStorageService.get("user");
    var channelDataName = "channel" + $scope.user.uid;
    $scope.listChannel = [];
  	$scope.listUser = [];
    var chooseChannel = {};
  	var dataSendMessage = {};
  	$scope.form = {search:"", message:""};
  	$scope.listMessage = [];
    $scope.historyUser = {};
    $scope.disableForm = true;
    $scope.listChannelLocal = {};
    var listChannelForSearch;
    $scope.listUserForSearch = [];
    $scope.listUserAddNewChannel = [];
    var listChannelLocalDatabase = [];
    var chooseChannelLocalDatabase;
    $scope.listChatName = {};
    var currentDate = moment(new Date()).format("DD/MM/YYYY");
    var prevDate = moment($time.getPrevDate(new Date())).format("DD/MM/YYYY");
    $scope.listClass = [];
    $scope.time = {
      delay: new Date()
    }

    $scope.popup1 = {
      opened: false
    };$scope.popup2 = {
      opened: false
    };
    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };
    $scope.open2 = function() {
      $scope.popup2.opened = true;
    };
    $scope.dateOptionsReceipt = {
      dateDisabled: false,
      formatYear: 'yy',
      startingDay: 1,
      dateFormat: 'dd-MM-yyyy HH:mm'
    };

    var _init = function(){
      if(localStorageService.get("channels")){
        $scope.listChannelLocal = localStorageService.get("channels");
      } else{
        localStorageService.set("channels", {});
      }
    
      $Imchat.initImchat({}, function(result){
        $scope.listChannel = _.reject(result, function(channel){
          return channel[1].type || channel[1].state === "folded";
        });
        if($scope.listChannel.length > 0){
          _initChannelToDb($scope.listChannel, null);
          var listUserId = [];
          $scope.listChannel.forEach(function(channel){
            channel[1].users.forEach(function(user){
              listUserId.push(user.id);
            });
          });
          listUserId = _.uniq(listUserId);
          listChannelForSearch = JSON.parse(JSON.stringify($scope.listChannel));
          $resUser.getChatNameByUserId({user_ids: listUserId}, function(resultChatName){
            $scope.listChatName = resultChatName;
            $scope.listChannel.forEach(function(channel){
              var title = "";
              channel[1].users.forEach(function(user){
                if(user.id != $scope.user.uid){
                  if(title.length === 0){
                    title = title + $scope.listChatName[user.id];
                  } else{
                    title = title + ", " + $scope.listChatName[user.id];
                  }
                }
              });
              channel.title = title;
            });
            $scope.chooseChannel($scope.listChannel[0]);
          }, function(error){$Error.callbackError(error);});
          $scope.listChannel.forEach(function(channel){
            if(!$scope.listChannelLocal[channel[1].uuid]){
              $scope.listChannelLocal[channel[1].uuid] = {};
            }
          });
          _saveChannelLocal($scope.listChannelLocal);
          $scope.listChannel.forEach(function(channel){
            $Imchat.getHistoryByUuid({uuid:channel[1].uuid}, function(history){
              $scope.listMessage = history.reverse();
              if($scope.listMessage.length > 0){
                channel.last_message = {
                  text: $scope.listMessage[$scope.listMessage.length -1].message,
                  date: $scope.listMessage[$scope.listMessage.length -1].showDate,
                  sort_date: $scope.listMessage[$scope.listMessage.length -1].create_date,
                };
                if(channel.last_message.text.length > 40){
                  channel.last_message.text =channel.last_message.text.substring(0, 37) + "...";
                }
                $scope.listChannelLocal[channel[1].uuid].last_message = channel.last_message;
              }
              _saveChannelLocal($scope.listChannelLocal);
              _sortListChannelByDate();
            },function(error){

            });
          });
        }
      }, function(error){
        $Error.callbackError(error);
      });
     
  	};
    var _sortListChannelByDate = function(){
      var flag = true;
      $scope.listChannel.forEach(function(channel){
        if(!channel.last_message || !channel.last_message.sort_date){
          flag = false;
        }
      });
      if(flag){
        $scope.listChannel = _.sortBy($scope.listChannel, function(channel){
          return -(new Date(channel.last_message.sort_date));
        });
      }
    }
  	_init();

    var _initChannelToDb = function(listChannel, channelFirst){
      $pouchDb.getAllDocs(channelDataName).then(function(allChannelLc){
        var newChannels = [];
        var lengtDb = allChannelLc.length +1;
        var count = 0;
        allChannelLc.forEach(function(channelLc){
          count++;
          if(!channelLc.index){
            channelLc.index = count;
          }
        })
        listChannel.forEach(function(channel){
          lengtDb++;
          var existChannel = _.find(allChannelLc, function(channelLc){
            return channelLc._id === channel[1].uuid;
          });
          if(!existChannel){
            newChannels.push({
              _id: channel[1].uuid,
              channel: channel,
              listMessage: [],
              index: lengtDb
            })
            channel.index = lengtDb;
          } else{
            channel.index = existChannel.index;
          }
        });
        $scope.listChannel = _.sortBy(listChannel, function(channel){
          return channel.index;
        });
        $pouchDb.bulkDocs(channelDataName, newChannels).then(function(result){
          $pouchDb.getAllDocs(channelDataName).then(function(allChannelLcDb){
            listChannelLocalDatabase = allChannelLcDb;
          })
        });
      });
    };

    var _updateChannelToDb = function(){
      if(chooseChannelLocalDatabase){
        $pouchDb.updateDoc(channelDataName, chooseChannelLocalDatabase).then(function(result){
          chooseChannelLocalDatabase._rev = result.rev;
        });
      }
    };

    var _saveChannelLocal = function(listChannel){
      localStorageService.set("channels", listChannel);
    };

    // listen event new message
    MultipleViewsManager.updated('new_message', function (data) {
      var newMessage = localStorageService.get("new_message")[0].message;
      if(newMessage.type){
        if(newMessage.type === "message"){
          if(!$scope.listChannelLocal[newMessage.to_id[1]]){
            $scope.listChannelLocal[newMessage.to_id[1]] = {};
          }
          $scope.listChannelLocal[newMessage.to_id[1]].last_message = {
            text: newMessage.message,
            date: "Hôm nay "+ moment(newMessage.create_date).format("HH:mm A")
          };
          if(chooseChannel && chooseChannel.length > 0){
            if(chooseChannel[1].uuid !== newMessage.to_id[1]){
              $scope.listChannelLocal[newMessage.to_id[1]].numberNotifi ? $scope.listChannelLocal[newMessage.to_id[1]].numberNotifi++ : $scope.listChannelLocal[newMessage.to_id[1]].numberNotifi = 1;
            } else{
              $scope.listMessage.push({
                showDate:  "Hôm nay "+ moment(new Date()).format("HH:mm A"),
                from_id: newMessage.from_id,
                message: newMessage.message
              });
            }
          }
          if(chooseChannelLocalDatabase){
            chooseChannelLocalDatabase.listMessage.push(
              {message: newMessage.message, from_id: newMessage.from_id, 
                date: moment(newMessage.create_date).format("DD/MM/YYYY HH:mm A"), uuid: newMessage.to_id[1]}
            );
            _updateChannelToDb();
          }
          var existChannel = _.find($scope.listChannel, function(channel){
            return channel[1].uuid === newMessage.to_id[1];
          });
          if(!existChannel){
             $Imchat.updateState({uuid: newMessage.to_id[1]}, function(update){
              _init();
             }, function(error){
                $Error.callbackError(error);
             });
          } else{
            $scope.listChannel = _.reject($scope.listChannel, function(channel){
              return channel[1].uuid === existChannel[1].uuid;
            });
            $scope.listChannel.unshift(existChannel);
          }
          _saveChannelLocal($scope.listChannelLocal);
        } else if(newMessage.type === "meta"){
          var existChannel = _.find($scope.listChannel, function(channel){
            return channel[1].uuid === newMessage.to_id[1];
          });
          if(existChannel){
            $scope.listChannel = _.reject($scope.listChannel, function(channel){
              return channel[1].uuid === existChannel[1].uuid;
            });
            $scope.listChannel.unshift(existChannel);
          }
        } else{
          
        }
      } else{
        if(!newMessage.state){
          $Imchat.updateState({uuid: newMessage.uuid}, function(update){
            var newChannel = [
              localStorageService.get("new_message")[0].channel,
              {
                state: "open",
                users: newMessage.users,
                uuid: newMessage.uuid
              }
            ];
            $scope.listChannel.unshift(newChannel);
            listChannelForSearch = JSON.parse(JSON.stringify($scope.listChannel));
          }, function(error){$Error.callbackError(error);});
        } else if(newMessage.state === "open"){
          var existChannel = _.find($scope.listChannel, function(channel){
            return channel[1].uuid === newMessage.uuid;
          });
          if(existChannel){
            existChannel[1].users = newMessage.users;
            var listUserId = [];
            newMessage.users.forEach(function(user){
              if(!$scope.listChatName[user.id]){
                listUserId.push(user.id);
              }
            });
            if(listUserId.length > 0){
              $resUser.getChatNameByUserId({user_ids: listUserId}, function(resultChatName){
                listUserId.forEach(function(user_id){
                  $scope.listChatName[user_id] = resultChatName[user_id];
                });
                var title = "";
                existChannel[1].users.forEach(function(user){
                  if(user.id != $scope.user.uid){
                    if(title.length === 0){
                      title = title + $scope.listChatName[user.id];
                    } else{
                      title = title + ", " + $scope.listChatName[user.id];
                    }
                  }
                });
                existChannel.title = title;
                $scope.chooseChannel($scope.listChannel[0]);
              }, function(error){$Error.callbackError(error);});
            } else{
              var title = "";
              existChannel[1].users.forEach(function(user){
                if(user.id != $scope.user.uid){
                  if(title.length === 0){
                    title = title + $scope.listChatName[user.id];
                  } else{
                    title = title + ", " + $scope.listChatName[user.id];
                  }
                }
              });
              existChannel.title = title;
              $scope.chooseChannel(existChannel);
            }
          } else{
            var newChannel = [
              localStorageService.get("new_message")[0].channel,
              {
                state: "open",
                users: newMessage.users,
                uuid: newMessage.uuid
              }
            ]
            $scope.listChannel.unshift(newChannel);

            _initChannelToDb($scope.listChannel, newChannel);
          }
        }
      }
      console.log(newMessage);
    });

  	$scope.chooseChannel = function(channel){
      if(!$scope.listChannelLocal[channel[1].uuid]){
        $scope.listChannelLocal[channel[1].uuid] = {};
      }
      chooseChannelLocalDatabase = _.find(listChannelLocalDatabase, function(chanLc){
        return chanLc._id === channel[1].uuid;
      });
      $scope.disableForm = false;
  		chooseChannel  = channel;
      $scope.listChannelLocal[channel[1].uuid].numberNotifi = 0;
      $scope.listChannel.forEach(function(chan){
        if(chan[1].uuid !== channel[1].uuid){
          chan.show = false;
        } else{
          chan.show = true;
        }
      });
      $Imchat.getHistoryByUuid({uuid:channel[1].uuid}, function(history){
        $scope.listMessage = history.reverse();
        $scope.listMessage.forEach(function(message){
          if(moment(message.create_date).format("DD/MM/YYYY") === currentDate){
            message.showDate = moment(moment.tz(message.create_date, moment.tz.guess())._d).format("hh:mm A") +" Hôm nay ";
          } else if(moment(message.create_date).format("DD/MM/YYYY") === prevDate){
            message.showDate = moment(moment.tz(message.create_date, moment.tz.guess())._d).format("hh:mm A") +" Hôm qua";
          } else{
            message.showDate = moment(moment.tz(message.create_date, moment.tz.guess())._d).format("hh:mm A DD/MM/YYYY");
          }
        });
        if($scope.listMessage.length > 0){
          channel.last_message = {
            text: $scope.listMessage[$scope.listMessage.length -1].message,
            date: $scope.listMessage[$scope.listMessage.length -1].showDate,
          };
          $scope.listChannelLocal[channel[1].uuid].last_message = channel.last_message;
        }
        _saveChannelLocal($scope.listChannelLocal);
      }, function(error){
        $Error.callbackError(error);
      });
  	};

    $scope.sendMessage = function(){
      var to_users = [];
      if($scope.form.message.length >0){
        if(!$scope.chooseTimeDelay){
          chooseChannel[1].users.forEach(function(user){
            if(user.id != $scope.user.uid){
              to_users.push({id: user.id, name: $scope.listChatName[user.id] || user.name});
            }
          })
        	var info = {
        		message: $scope.form.message,
        		uuid: chooseChannel[1].uuid,
            to_users: to_users,
            from_user: {id: $scope.user.uid, name: $scope.listChatName[$scope.user.uid] || $scope.user.username}
        	};
          $scope.form.message = "";
        	$Imchat.postMessage(info, function(result){
          }, function(error){
            $Error.callbackError(error);
          });
        } else{
          var info = {
            message: $scope.form.message,
            uuid: chooseChannel[1].uuid,
            delayTime: moment($scope.time.delay).format("YYYY-MM-DD HH:mm:ss")
          };
          $scope.form.message = "";
          $Imchat.postMessageDelay(info, function(result){
            $scope.chooseTimeDelay = false;
           /* $Imchat.getMessageById({id: result}, function(message){
              $Error.callbackError(error);
            }, function(error){})*/
          }, function(error){
            $Error.callbackError(error);
          });
        }
      } else{
        toastr.warning("Bạn chưa nhập tin nhắn", "", {});
      }

    };

    var modalCreateGroup;
    $scope.searchForm = {
      teacher: false,
      parent: false,
      groupParent: false
    };
    $scope.chooseClass = {};
    var listTeacherLocal;
    var listParentLocal;
    $scope.listTeacher = [];
    $scope.listParent = [];
    $scope.listStudent = {};
    $scope.listParentGroup = [];

    $scope.openPopupCreateGroup = function () {
      $scope.listTeacher = [];
      $scope.listParent = [];
      $scope.listUserForSearch = [];
      $scope.listParentGroup = [];
      $scope.listUserAddNewChannel = [];
      $scope.chooseClass.id = null;
      $scope.searchForm.checkallteacher = false;
      $scope.searchForm.checkallparent = false;
      $scope.searchForm.checkallgroup = false;
      $scope.tab = "teacher";
      if($scope.listClass.length === 0){
        $SchoolClass.getAllClass({}, function(result){
            $scope.listClass = result.records;
            modalCreateGroup = $uibModal.open({
              animation: true,
              templateUrl: "app/pages/message/widgets/popup.create.group.html",
              scope: $scope
            });
          }, function(error){
            $Error.callbackError(error);
          })
      } else{
        modalCreateGroup = $uibModal.open({
          animation: true,
          templateUrl: "app/pages/message/widgets/popup.create.group.html",
          scope: $scope
        });
      }
    };

    $scope.changeClass = function(){
      var existClass = _.find($scope.listClass, function(tmpClass){
        return tmpClass.id === $scope.chooseClass.id;
      });
      $scope.listTeacher = [];
      $scope.listParent = [];
      $scope.listUserForSearch = [];
      $scope.listParentGroup = [];
      $Teacher.getListTeacherByIds({ids: existClass.teacher_ids}, function(listTeacher){
        listTeacherLocal = JSON.parse(JSON.stringify(listTeacher));
        $scope.listTeacher = listTeacher;
        $scope.listTeacher = _.reject($scope.listTeacher, function(teacher){
          return teacher.user_id[0] === $scope.user.uid;
        })
        $scope.listUserForSearch = $scope.listUserForSearch.concat($scope.listTeacher);
      }, function(error){$Error.callbackError(error);});
      $Parent.getListParentByIds({parent_ids: existClass.parent_ids}, function(listParent){
        $Student.getListStudentByIds({student_ids: existClass.student_ids}, function(listStudent){
          $scope.listStudent = _.groupBy(listStudent, function(student){
            return student.id;
          })
          listParentLocal = JSON.parse(JSON.stringify(listParent));
          $scope.listParent = listParent;
          $scope.listParentGroup = _.filter(listParentLocal, function(parent) {
            return parent.category_id && parent.category_id.length > 0;
          });
          $scope.listUserForSearch = $scope.listUserForSearch.concat($scope.listParent);
        }, function(error){
          $Error.callbackError(error);
        });
      }, function(error){
        $Error.callbackError(error);
      });
    };

    $scope.adduserForChannel = function(user){
      var existUser = _.find($scope.listUserAddNewChannel, function(use){
        return use.id === user.id;
      });
      if(!existUser){
        $scope.listUserAddNewChannel.push(user);
      }
    };

    $scope.chooseParent = function(parent){
      if(!parent.parent_user_id){
        toastr.warning("Phụ huynh "+parent.name+" chưa được đăng ký tài khoản", "", {});
      } else{
        parent.checked = !parent.checked;
      }
    }

    $scope.createChannel = function(){ 
      if(_validateUserAddChannel()){
        if($scope.listUserAddNewChannel.length > 0){
          if(!_checkChannelExist()){
            $Imchat.createChannel({user_ids: [$scope.user.uid]}, function(result){
              console.log(result);
              $Imchat.getSessionById({id: result}, function(session){
                $Imchat.updateState({uuid: session.records[0].uuid}, function(update){
                  $scope.listUserAddNewChannel.forEach(function(user){
                    if(user.parent_user_id){
                      $scope.listChatName[user.parent_user_id[0]] = user.name;
                      $Imchat.addUserToChannel({uuid: session.records[0].uuid, user_id: user.parent_user_id[0]}, function(addUser){
                      }, function(error){$Error.callbackError(error);});
                    } else if(user.user_id){
                      $scope.listChatName[user.user_id[0]] = user.name;
                      $Imchat.addUserToChannel({uuid: session.records[0].uuid, user_id: user.user_id[0]}, function(addUser){
                      }, function(error){$Error.callbackError(error);});
                    }
                  });
                  modalCreateGroup.dismiss('cancel');
                }, function(error){$Error.callbackError(error);});
              }, function(error){$Error.callbackError(error);});
            }, function(error){$Error.callbackError(error);});
          }
        }
      } else{
        toastr.warning("Tài khoản phụ huynh chưa được đăng ký", "", {});
      }
    };

    var _checkChannelExist = function(){
      var flag = false;
      if($scope.listUserAddNewChannel.length > 1){
      } else{
        var userTmp = $scope.listUserAddNewChannel[0];
        if(userTmp.parent_user_id){
          userTmp.user_id = userTmp.parent_user_id;
        }
        var listChannelTwoUser = _.filter($scope.listChannel, function(channel){
          return channel[1].users.length == 2
        });
        listChannelTwoUser = JSON.parse(JSON.stringify(listChannelTwoUser));
        listChannelTwoUser = _.forEach(listChannelTwoUser, function(channel){
          var tmpUsers = _.reject(channel[1].users, function(tmp){
            return tmp.id === $scope.user.uid;
          });
          channel.user = tmpUsers[0];
        })
        var existChannel = _.find(listChannelTwoUser, function(tmp){
          return tmp.user.id === userTmp.user_id[0];
        })
        if(!existChannel){
        } else{
          $scope.chooseChannel(existChannel);
          modalCreateGroup.dismiss('cancel');
          flag =true;
        }
      }
      return flag;
    }

    var _validateUserAddChannel = function(){
      var flag = false;
      $scope.listTeacher.forEach(function(teacher){
        if(teacher.checked){
          $scope.adduserForChannel(teacher);
        }
      });
      $scope.listParent.forEach(function(parent){
        if(parent.checked){
          $scope.adduserForChannel(parent);
        }
      });
      $scope.listParentGroup.forEach(function(parent){
        if(parent.checked){
          $scope.adduserForChannel(parent);
        }
      })
      $scope.listUserAddNewChannel.forEach(function(user){
        if(user.parent_user_id && user.parent_user_id[0] != $scope.user.uid){
          flag = true;
        }
        if(user.user_id && user.user_id[0] != $scope.user.uid){
          flag = true;
        }
      });
      return flag;
    }
    
    $scope.listMessageToSeach = [];
    $scope.searchUser = function(){
      $scope.listMessageToSeach = [];
      if($scope.form.search && $scope.form.search.length > 0){
        var strSearch = _bodauTiengViet($scope.form.search);
        $pouchDb.getAllDocs(channelDataName).then(function(allChannelLcDb){
          listChannelLocalDatabase = allChannelLcDb;
          listChannelLocalDatabase.forEach(function(channel){
            channel.listMessage.forEach(function(message){
              if(_bodauTiengViet($scope.listChatName[message.from_id[0]]).toUpperCase().indexOf(strSearch.toUpperCase()) >=0 ||
                _bodauTiengViet(message.message).toUpperCase().indexOf(strSearch.toUpperCase()) >=0 ){
                $scope.listMessageToSeach.push(message);
              }
            })
          });
          if($scope.listMessageToSeach.length === 0){
            toastr.warning("Không tìm thấy tin nhắn", "", {});
          }
        });
      }
    };
    $scope.chooseChannelLc = function(message){
      $scope.listMessageToSeach = [];
      var existChannel = _.find($scope.listChannel, function(channel){
        return channel[1].uuid === message.uuid;
      });
      if(existChannel){
        $scope.chooseChannel(existChannel);
      } else{
         $Imchat.updateState({uuid: message.uuid}, function(update){
            $scope.listChannel.push([
              localStorageService.get("new_message")[0].channel,
              {
                state: "open",
                users: newMessage.users,
                uuid: newMessage.uuid
              }
            ]);
          }, function(error){$Error.callbackError(error);});
      }
    };

    $scope.changeSearch = function(){
      if($scope.form.search.length === 0){
          $scope.listMessageToSeach = [];
         $pouchDb.getAllDocs(channelDataName).then(function(allChannelLcDb){
          listChannelLocalDatabase = allChannelLcDb;
          if(chooseChannelLocalDatabase){
            var existChannel = _.find(listChannelLocalDatabase, function(channel){
              return channel._id === chooseChannelLocalDatabase._id;
            });
            chooseChannelLocalDatabase._rev =  existChannel._rev;
          }
        });
      }
    }

    var  _bodauTiengViet = function(str) {  
      if(str){
        str= str.toLowerCase();  
        str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");  
        str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");  
        str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");  
        str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");  
        str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");  
        str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");  
        str= str.replace(/đ/g,"d");  
        return str;  
      } else{
        return "";
      }
    };


    var _renderListTeacherByListScheduleLines = function(lines){
    };

    var modalSetTimeDelay;
    $scope.chooseTimeDelay = false;

    $scope.openSetTimeDelay = function (teacher) {
      modalSetTimeDelay = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/message/widgets/popup.time.delay.html",
        scope: $scope
      });
    };
    $scope.setTimeDelay = function(){
      $scope.chooseTimeDelay = true;
      modalSetTimeDelay.dismiss('cancel');
    };

    $scope.removeChannel = function(){
      $Imchat.updateStateToClose({uuid: chooseChannel[1].uuid}, function(result){
        $scope.listMessage = [];
        $scope.disableForm = true;
        $pouchDb.getAllDocs(channelDataName).then(function(allChannelLc){
          var existChannel = _.find(allChannelLc, function(channel){
            return channel._id === chooseChannel[1].uuid;
          });
          if(existChannel){
            $pouchDb.deleteDoc(channelDataName, existChannel).then(function(result){
              $pouchDb.getAllDocs(channelDataName).then(function(allChannelLcDb){
                listChannelLocalDatabase = allChannelLcDb;
              })
            });
          }
        });
        /*$scope.listChannel = _.reject($scope.listChannel, function(channel){
          return channel[1].uuid === chooseChannel[1].uuid;
        });*/
        modalConfirmRemove.dismiss('cancel');
        _init();
      }, function(error){$Error.callbackError(error);})
    };
    var modalConfirmRemove;
    $scope.confirmRemove = function(chooseClass){
      modalConfirmRemove = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/message/widgets/popup.confrim.remove.html",
        scope: $scope
      });
    };
    $scope.tab = "teacher";
    $scope.chooseTab = function(tab){
      $scope.tab = tab;
    }
    $scope.changeCheckAll = function(){
      if($scope.tab === "teacher"){
        $scope.listTeacher.forEach(function(teacher){
          teacher.checked = $scope.searchForm.checkallteacher;
        })
      } else if($scope.tab === "parent"){
        $scope.listParent.forEach(function(parent){
          if(parent.parent_user_id){
            parent.checked = $scope.searchForm.checkallparent;
          }
        })
      } else{
         $scope.listParentGroup.forEach(function(parent){
          parent.checked = $scope.searchForm.checkallgroup;
        })
      }
    };
    $scope.changeCheckUser = function(){
      if($scope.tab === "teacher"){
        $scope.searchForm.checkallteacher = false;
      } else if($scope.tab === "parent"){
        $scope.searchForm.checkallparent = false;
      } else{
        $scope.searchForm.checkallgroup = false;
      }
    }
  }

})();
