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
    $Teacher, $Parent, $Student, MultipleViewsManager, $Error) {
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
    $scope.listUserForSearch = [];
    $scope.listUserAddNewChannel = [];
    $scope.listChatName = {};
    var currentDate = moment(new Date()).format("DD/MM/YYYY");
    var prevDate = moment($time.getPrevDate(new Date())).format("DD/MM/YYYY");
    $scope.listClass = [];

    var _init = function(){
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
          listUserId = _.uniq(listUserId);
          $resUser.getChatNameByUserId({user_ids: listUserId}, function(resultChatName){
            $scope.listChatName = resultChatName;
            $scope.chooseChannel($scope.listChannel[0]);
          }, function(error){$Error.callbackError(error);});
        }
      }, function(error){
        $Error.callbackError(error);
      })
  	};
  	_init();

    var _saveChannelLocal = function(listChannel){
      localStorageService.set("channels", listChannel)
    }

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
          _saveChannelLocal($scope.listChannelLocal);
        } else if(newMessage.type === "meta"){
         /* $Imchat.updateState({uuid: newMessage.uuid}, function(update){
            $scope.listChannel.push([
              $scope.listChannel[0][0],
              {
                status: "open",
                users: newMessage.users,
                uuid: newMessage.uuid
              }
            ])
          }, function(error){})*/
        } else{
          
        }
      } else{
        if(!newMessage.state){
          $Imchat.updateState({uuid: newMessage.uuid}, function(update){
            $scope.listChannel.push([
              localStorageService.get("new_message")[0].channel,
              {
                state: "open",
                users: newMessage.users,
                uuid: newMessage.uuid
              }
            ])
          }, function(error){$Error.callbackError(error);});
        } else{
          var existChannel = _.find($scope.listChannel, function(channel){
            return channel[1].uuid === newMessage.uuid;
          });
          if(existChannel){
            existChannel[1].users = newMessage.users;
          } else{
            $scope.listChannel.push([
              localStorageService.get("new_message")[0].channel,
              {
                state: "open",
                users: newMessage.users,
                uuid: newMessage.uuid
              }
            ]);
          }
        }
      }
      console.log(newMessage);
    });

  	$scope.chooseChannel = function(channel){
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

    $scope.sendMessage = function(){
    	var info = {
    		message: $scope.form.message,
    		uuid: chooseChannel[1].uuid
    	};
      $scope.form.message = "";
    	$Imchat.postMessage(info, function(result){
      }, function(error){
        $Error.callbackError(error);
      });

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
        $scope.searchForm.teacher = true;
        $scope.listTeacher = listTeacher;
        $scope.listUserForSearch = $scope.listUserForSearch.concat($scope.listTeacher);
      }, function(error){$Error.callbackError(error);});
      $Parent.getListParentByIds({parent_ids: existClass.parent_ids}, function(listParent){
        $Student.getListStudentByIds({student_ids: existClass.student_ids}, function(listStudent){
          $scope.listStudent = _.groupBy(listStudent, function(student){
            return student.id;
          })
          listParentLocal = JSON.parse(JSON.stringify(listParent));
          $scope.searchForm.parent = true;
          $scope.searchForm.groupParent = true;
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
    $scope.createChannel = function(){ 
     /* var user_ids = [$scope.user.uid];
      $scope.listUserAddNewChannel.forEach(function(user){
        user_ids.push(user.user_id[0]);
      })*/
      $Imchat.createChannel({user_ids: [$scope.user.uid]}, function(result){
        console.log(result);
        $Imchat.getSessionById({id: result}, function(session){
          $Imchat.updateState({uuid: session.records[0].uuid}, function(update){
            $scope.listUserAddNewChannel.forEach(function(user){
              if(user.parent_user_id){
                $scope.listChatName[user.parent_user_id[0]] = user.name;
                $Imchat.addUserToChannel({uuid: session.records[0].uuid, user_id: user.parent_user_id[0]}, function(addUser){
                }, function(error){$Error.callbackError(error);});
              } else{
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


    var _renderListTeacherByListScheduleLines = function(lines){
    }
  }

})();
