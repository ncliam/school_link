/* global angular, document, window */
'use strict';

angular.module('starter.controllers')
.controller('MessageCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $Imchat, localStorageService, $rootScope,
  $time, MultipleViewsManager, $resUser, $state, $Error, $ionicSideMenuDelegate, $ionicModal, SchoolService, $location, $SchoolClass, $translate, $pouchDb) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.$parent.showMenuRightButton();
    $scope.$parent.showTabs();
    $ionicSideMenuDelegate.canDragContent(true);
    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    $scope.user = localStorageService.get("user");
    $scope.listChannel = [];
    $scope.listUser = [];
    var chooseChannel = {};
    var dataSendMessage = {};
    $scope.form = {};
    $scope.listMessage = [];
    $scope.historyUser = {};
    $scope.disableForm = true;
    $scope.listChannelLocal = {};
    var listChannelForSearch;
    $scope.listUserForSearch = [];
    $scope.listUserAddNewChannel = [];
    $scope.listChatName = {};
    var currentDate = moment(new Date()).format("DD/MM/YYYY");
    var prevDate = moment($time.getPrevDate(new Date())).format("DD/MM/YYYY");
    $scope.listClass = [];
    var _createNewChannel = function(){
      var user = localStorageService.get("user_add_channel");
      if(user){
        $Imchat.createChannel({user_ids: [$scope.user.uid]}, function(result){
          $Imchat.getSessionById({id: result}, function(session){
            $Imchat.updateState({uuid: session.records[0].uuid}, function(update){
              if(user.parent_user_id){
                $scope.listChatName[user.parent_user_id[0]] = user.name;
                $Imchat.addUserToChannel({uuid: session.records[0].uuid, user_id: user.parent_user_id[0]}, function(addUser){
                  localStorageService.remove("user_add_channel");
                }, function(error){
                  localStorageService.remove("user_add_channel");
                });
              } else{
                $scope.listChatName[user.user_id[0]] = user.name;
                $Imchat.addUserToChannel({uuid: session.records[0].uuid, user_id: user.user_id[0]}, function(addUser){
                  localStorageService.remove("user_add_channel");
                }, function(error){
                  localStorageService.remove("user_add_channel");
                });
              }
              
            }, function(error){$Error.callbackError(error);});
          }, function(error){$Error.callbackError(error);});
        }, function(error){$Error.callbackError(error);});
      }
    };

    var _init = function(){
      if($scope.add_new_channel){
        $state.go("app.channel");
      } else{
        localStorageService.remove("chooseChannel");
        if(localStorageService.get("channels")){
          $scope.listChannelLocal = localStorageService.get("channels");
        } else{
          localStorageService.set("channels", {});
        }
      
        $Imchat.initImchat({}, function(result){
          $scope.listChannel = _.reject(result, function(channel){
            return channel[1].type;
          });
          if($scope.listChannel.length > 0){
            var listUserId = [];
            $scope.listChannel.forEach(function(channel){
              channel[1].users.forEach(function(user){
                listUserId.push(user.id);
              });
            });
            listUserId.push($scope.user.uid);
            listUserId = _.uniq(listUserId);
            listChannelForSearch = JSON.parse(JSON.stringify($scope.listChannel));
            localStorageService.set("listChannelInit", $scope.listChannel);
            $resUser.getChatNameByUserId({user_ids: listUserId}, function(resultChatName){
              $scope.listChatName = resultChatName;
              localStorageService.set("listChatName", $scope.listChatName);
            }, function(error){
              $Error.callbackError(error);
            });
            $scope.listChannel.forEach(function(channel){
              if(!$scope.listChannelLocal[channel[1].uuid]){
                $scope.listChannelLocal[channel[1].uuid] = {};
              }
            });
             _saveChannelLocal($scope.listChannelLocal);
            $scope.listChannel.forEach(function(channel){
              $Imchat.getHistoryByUuid({uuid:channel[1].uuid}, function(history){
                $scope.listMessage = history.reverse();
                $scope.listMessage.forEach(function(message){
                  if(moment(message.create_date).format("DD/MM/YYYY") === currentDate){
                    message.showDate = moment(message.create_date).format("HH:mm A") + " "+ $translate.instant('today');
                  } else if(moment(message.create_date).format("DD/MM/YYYY") === prevDate){
                    message.showDate = moment(message.create_date).format("HH:mm A") + " "+ $translate.instant('prev_day');
                  } else{
                    message.showDate = moment(message.create_date).format("HH:mm A DD/MM/YYYY");
                  }
                });
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

              })
            })
          }
          /*$timeout(function() {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
          }, 200);*/
        }, function(error){
          $Error.callbackError(error);
        })
      }
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

    var _initChannelLocalDb = function(listChannel){
      $pouchDb.getAllDocs("channels").then(function(allChannelLc){
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
        $pouchDb.bulkDocs("channels", newChannels).then(function(result){
          $pouchDb.getAllDocs("channels").then(function(allChannelLcDb){
           /* if(channelFirst){
              _updateLocationChannelLocal(channelFirst);
            }*/
          })
        });
      });
    };

    var _updateLocationChannelLocal = function(channel){
      $pouchDb.getAllDocs("channels").then(function(allChannelLc){
        allChannelLc.forEach(function(channelLc){
          if(channelLc._id === channel[1].uuid){
            channelLc.index =1;
          } else{
            channelLc.index++;
          }
        });
        $pouchDb.bulkDocs("channels", allChannelLc).then(function(result){
          /*$pouchDb.getAllDocs("channels").then(function(allChannelLcDb){
            listChannelLocalDatabase = allChannelLcDb;
          })*/
        });
      });
    };

     _init();

    MultipleViewsManager.updated('add_new_channel', function (data) {
      var user = localStorageService.get("user_add_channel");
      _createNewChannel();
    });

    var _saveChannelLocal = function(listChannel){
      localStorageService.set("channels", listChannel)
    };

    // listen event new message
    MultipleViewsManager.updated('new_message', function (data) {
      var newMessage = localStorageService.get("new_message")[0].message;
      var chooseChannel = localStorageService.get("chooseChannel");
      if(newMessage.type){
        if(newMessage.type === "message"){
          if(!$scope.listChannelLocal[newMessage.to_id[1]]){
            $scope.listChannelLocal[newMessage.to_id[1]] = {};
          }
          $scope.listChannelLocal[newMessage.to_id[1]].last_message = {
            text: newMessage.message,
            date: moment(newMessage.create_date).format("HH:mm A")+ " "+ $translate.instant('today')
          };
          if(chooseChannel && chooseChannel.length > 0){
            if(chooseChannel[1].uuid !== newMessage.to_id[1]){
              $scope.listChannelLocal[newMessage.to_id[1]].numberNotifi ? $scope.listChannelLocal[newMessage.to_id[1]].numberNotifi++ : $scope.listChannelLocal[newMessage.to_id[1]].numberNotifi = 1;
            } else{
              localStorageService.set("message_channel", localStorageService.get("new_message"))
              MultipleViewsManager.updateView("message_channel");
              $scope.listMessage.push({
                showDate:  $translate.instant('today') + " "+ moment(new Date()).format("HH:mm A"),
                from_id: newMessage.from_id,
                message: newMessage.message
              });
            }
          } else{
            $scope.listChannelLocal[newMessage.to_id[1]].numberNotifi ? $scope.listChannelLocal[newMessage.to_id[1]].numberNotifi++ : $scope.listChannelLocal[newMessage.to_id[1]].numberNotifi = 1;
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
            //_updateLocationChannelLocal(existChannel);
          }
          _saveChannelLocal($scope.listChannelLocal);
        } else if(newMessage.type === "meta"){
        } else{
          
        }
      } else{
        if(!newMessage.state){
          _updateStateAndAddToChannel(newMessage.uuid, newMessage.users);
        } else if(newMessage.state ==="open"){
          var existChannel = _.find($scope.listChannel, function(channel){
            return channel[1].uuid === newMessage.uuid;
          });
          if(existChannel){
            existChannel[1].users = newMessage.users;
          } else{
            existChannel = [
              localStorageService.get("new_message")[0].channel,
              {
                state: "open",
                users: newMessage.users,
                uuid: newMessage.uuid
              }
            ]
            $scope.listChannel.unshift(existChannel);
            listChannelForSearch = JSON.parse(JSON.stringify($scope.listChannel));
          }
          if(existChannel[1].users.length ===2){
            $scope.chooseChannel(existChannel);
          }
          localStorageService.remove("user_add_channel");
        } else if(newMessage.state ==="close"){
          _updateStateAndAddToChannel(newMessage, newMessage.users);
        }
      }
      MultipleViewsManager.updateView("notification_new_message");
    });

    var _updateStateAndAddToChannel = function(uuid, users){
      $Imchat.updateState({uuid: uuid}, function(update){
        $scope.listChannel.push([
          localStorageService.get("new_message")[0].channel,
          {
            state: "open",
            users: users,
            uuid: uuid
          }
        ]);
        listChannelForSearch = JSON.parse(JSON.stringify($scope.listChannel));
      }, function(error){$Error.callbackError(error);});
    }

   /* $scope.chooseChannel = function(channel){
      if(!$scope.listChannelLocal[channel[1].uuid]){
        $scope.listChannelLocal[channel[1].uuid] = {};
      }
      $scope.disableForm = false;
      channel.show = true;
        chooseChannel  = channel;
      $scope.listChannelLocal[channel[1].uuid].numberNotifi = 0;
      $scope.listChannel.forEach(function(chan){
        if(chan[1].uuid !== channel[1].uuid){
          chan.show = false;
        }
      });
      $Imchat.getHistoryByUuid({uuid:channel[1].uuid}, function(history){
        $scope.listMessage = history.reverse();
        $scope.listMessage.forEach(function(message){
          if(moment(message.create_date).format("DD/MM/YYYY") === currentDate){
            message.showDate = "Hôm nay "+ moment(message.create_date).format("HH:mm A");
          } else if(moment(message.create_date).format("DD/MM/YYYY") === prevDate){
            message.showDate = "Hôm qua "+ moment(message.create_date).format("HH:mm A");
          } else{
            message.showDate = moment(message.create_date).format("DD/MM/YYYY HH:mm A");
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
*/
    $scope.chooseChannel = function(channel){
      localStorageService.set("chooseChannel", channel);
      $state.go("app.channel");
    };

    $scope.createNewChat = function(){

    }

  $ionicModal.fromTemplateUrl('js/pages/message/modal-contact.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.userInfo = localStorageService.get("user");
    $scope.groups = [];
    $scope.teachers = [];
    $scope.parents = [];
    $scope.suppers = [];
    $scope.group = 'teachers';


    $scope.callTel = function(tel) {
      console.log('callTel');
      window.location.href = 'tel:'+ tel;
      // $event.stopPropagation();
    }

    $scope.changeGroup = function (val){
      $scope.group = val;
    }

    $scope.toggleGroup = function(group) {
      if($scope.group == 'teachers'){
        angular.forEach($scope.teachers, function(value, key) {
          if (value.id == group) {
            value.show = !value.show;
          }
        });
      }
      else if($scope.group === 'parents') {
        angular.forEach($scope.parents, function(value, key) {
          if (value.id == group) {
            value.show = !value.show;
          }
        });
      } else{
        angular.forEach($scope.suppers, function(value, key) {
          if (value.id == group) {
            value.show = !value.show;
          }
        });
      }
    };

    $scope.isGroupShown = function(group) {
      var ret;
      if($scope.group == 'teachers'){
        angular.forEach($scope.teachers, function(value, key) {
          if (value.id === group) {
            ret = value.show;
          }
        });
      }
      else if($scope.group === 'parents') {
        angular.forEach($scope.parents, function(value, key) {
          if (value.id === group) {
            ret = value.show;
          }
        });
      } else{
        angular.forEach($scope.suppers, function(value, key) {
          if (value.id === group) {
            ret = value.show;
          }
        });
      }
      return ret;
    };
    var class_id = localStorageService.get("class");
    $scope.listChildren = {};
    $SchoolClass.getClassById({id: class_id}, function(result){
      var currentClass = result.records[0];
      $SchoolClass.getListTeacherByIds({ids: currentClass.teacher_ids}, function(listTeacher){
        $scope.teachers = listTeacher;
      }, function(error){$Error.callbackError(error);});
      $SchoolClass.getListParentByIds({parent_ids: currentClass.parent_ids}, function(listParent){
        $scope.parents = listParent;
        $scope.suppers = _.filter($scope.parents, function(parent) {
          return parent.category_id.length > 0;
        });
        var children_ids = [];
        $scope.parents.forEach(function(parent){
          children_ids = children_ids.concat(parent.children);
        });
        $resUser.getStudentById({student_ids: children_ids}, function(listChildren){
          listChildren.forEach(function(child){
            $scope.listChildren[child.id] = child;
          })
        }, function(error){
          $Error.callbackError(error);
        })
      }, function(error){
        $Error.callbackError(error);
      });
    }, function(error){

    });
    /*var children = localStorageService.get("children");
    SchoolService.getContacts({userInfo:$scope.userInfo, student_id: children.id}).then(function(result){
      console.log('getContacts return ', result);
      if(result.status){
        $scope.teachers = result.teacherResults;
        $scope.parents = result.parentResults;
        $scope.suppers = _.filter($scope.parents, function(parent) {
          return parent.category_id.length > 0;
        });
      }
    });*/

    var _getScheduleBySemester = function(){
      SchoolService.getTKB({userInfo:$scope.userInfo}).then(function(result){
        if(result.status){
          $scope.tkb = result.tkbbd;
          $scope.groupTeacher = _.groupBy($scope.tkb, function(day){
            return day.teacher_id[0];
          });
          Object.keys($scope.groupTeacher).forEach(function(key){
            $scope.groupTeacher[key] = _.uniq($scope.groupTeacher[key], function(tkb){
              return tkb.subject_id[0];
            })
          })
        }
      })
    };
    _getScheduleBySemester();

    $scope.createChannel = function(user){
      $scope.closeModal();
      if(user.user_id || user.parent_user_id){
        $scope.listChannel = localStorageService.get("listChannelInit");
        if(user.parent_user_id){
          user.user_id = user.parent_user_id;
        }
        if(user){
          var listChannelTwoUser = _.filter($scope.listChannel, function(channel){
            return channel[1].users.length == 2
          });
          var existuser;
          var existChannel;
          listChannelTwoUser = JSON.parse(JSON.stringify(listChannelTwoUser));
          listChannelTwoUser = _.forEach(listChannelTwoUser, function(channel){
            var tmpUsers = _.reject(channel[1].users, function(tmp){
              return tmp.id === $scope.userInfo.uid;
            });
            channel.user = tmpUsers[0];
          })
          var existChannel = _.find(listChannelTwoUser, function(tmp){
            return tmp.user.id === user.user_id[0];
          });
          if(!existChannel){
            localStorageService.set("user_add_channel", user);
            MultipleViewsManager.updateView("add_new_channel");
            $state.go("app.message");
          } else{
            localStorageService.set("chooseChannel", existChannel);
            $state.go("app.channel");
          }
        }
        
       
      }
      console.log(user);
    };

   /* $scope.callPhoneNumber = function(user){
      window.open('tel:' + user.mobile, '_system')
    };
    $scope.sendEmail = function(user){
      window.open('mailto:' + user.email);
    };*/


})
