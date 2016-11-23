/* global angular, document, window */
'use strict';

angular.module('starter.controllers')
.controller('ChannelCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $Imchat, localStorageService, 
  $time, MultipleViewsManager, $resUser, $rootScope, $ionicScrollDelegate, $ionicActionSheet, $state, toaster) {
    $scope.$parent.hideHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.$parent.showMenuRightButton();
    $scope.$parent.hideTabs();

    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    function keyboardShowHandler(e){
      $ionicScrollDelegate.scrollBottom();
    }

    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    function keyboardHideHandler(e){
      $ionicScrollDelegate.scrollBottom();
    }

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
    $scope.user = localStorageService.get("user");
    $scope.listChannel = [];
    $scope.listUser = [];
    var chooseChannel = {};
    var dataSendMessage = {};
    $scope.form = {message:""};
    $scope.listMessage = [];
    $scope.historyUser = {};
    $scope.disableForm = true;
    $scope.listChannelLocal = localStorageService.get("channels");
    var listChannelForSearch;
    $scope.listUserForSearch = [];
    $scope.listUserAddNewChannel = [];
    $scope.listChatName = localStorageService.get("listChatName");
    var currentDate = moment(new Date()).format("DD/MM/YYYY");
    var prevDate = moment($time.getPrevDate(new Date())).format("DD/MM/YYYY");
    $scope.listClass = [];
    var _init = function(channel){
      if(!$scope.listChannelLocal[channel[1].uuid]){
        $scope.listChannelLocal[channel[1].uuid] = {};
      }
      $scope.disableForm = false;
      channel.show = true;
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
        $ionicScrollDelegate.scrollBottom();
      }, function(error){
        $Error.callbackError(error);
      });
    }
     var _saveChannelLocal = function(listChannel){
      localStorageService.set("channels", listChannel)
    };

   $scope.chooseChannel = localStorageService.get("chooseChannel");
   $scope.userChat = _.find($scope.chooseChannel[1].users, function(user){
    return user.id !== $scope.user.uid;
   });
    _init($scope.chooseChannel);

     // listen event new message
    MultipleViewsManager.updated('message_channel', function (data) {
      var newMessage = localStorageService.get("message_channel")[0].message;
      if(newMessage.type){
        if(newMessage.type === "message"){
          if(!$scope.listChannelLocal[newMessage.to_id[1]]){
            $scope.listChannelLocal[newMessage.to_id[1]] = {};
          }
          $scope.listChannelLocal[newMessage.to_id[1]].last_message = {
            text: newMessage.message,
            date: "Hôm nay "+ moment(newMessage.create_date).format("HH:mm A")
          };
          if($scope.chooseChannel && $scope.chooseChannel.length > 0){
            if($scope.chooseChannel[1].uuid === newMessage.to_id[1]){
              $scope.listMessage.push({
                showDate:  "Hôm nay "+ moment(new Date()).format("HH:mm A"),
                from_id: newMessage.from_id,
                message: newMessage.message
              });
            }
          }
          $ionicScrollDelegate.scrollBottom();
          _saveChannelLocal($scope.listChannelLocal);
        }
      } 
      console.log(newMessage);
    });


    $scope.sendMessage = function(){
      var to_users = [];
      if($scope.form.message.length > 0){
        $scope.chooseChannel[1].users.forEach(function(user){
          if(user.id != $scope.user.uid){
            to_users.push({id: user.id, name: $scope.listChatName[user.id]});
          }
        });
        var info = {
          message: $scope.form.message,
          uuid: $scope.chooseChannel[1].uuid,
          to_users: to_users,
          from_user: {id: $scope.user.uid, name: $scope.listChatName[$scope.user.id] || $scope.user.username}
        };
        $scope.form.message = "";
          $Imchat.postMessage(info, function(result){
        }, function(error){
          $Error.callbackError(error);
        });
      } else{
        toaster.pop('warning', "Cảnh báo", "Bạn phải nhập tin nhắn");
      }

    };

    $scope.showActionsheet = function() {
    
      $ionicActionSheet.show({
        buttons: [
          { text: '<i class="icon ion-trash-a"></i> Delete' }
        ],
        cancelText: 'Cancel',
        cancel: function() {
          console.log('CANCELLED');
        },
        buttonClicked: function(index) {
          $Imchat.updateStateToClose({uuid: $scope.chooseChannel[1].uuid}, function(result){
            $state.go("app.message");
          }, function(error){$Error.callbackError(error);});
          return true;
        },
        destructiveButtonClicked: function() {
          console.log('DESTRUCT');
          return true;
        }
      });
    };



})
