/* global angular, document, window */
'use strict';

angular.module('starter.controllers')
.controller('NotificationCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $Imchat, localStorageService, 
  $time, MultipleViewsManager, $resUser, $state, $Error, $ionicSideMenuDelegate, $Notification) {
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
    $scope.listNotification = [];
    var currentDate = moment(new Date()).format("DD/MM/YYYY");
    var prevDate = moment($time.getPrevDate(new Date())).format("DD/MM/YYYY");

    var _init = function(){
      $Notification.getNotification({}, function(result){
        $scope.listNotification = result;
        $scope.listNotification.forEach(function(noti){
          noti.showDate = moment(noti.date).format("DD/MM/YYYY hh:mm");
        })
      }, function(error){

      })

    };
    _init();
    $scope.gotoDetailNotification = function(notification){
        localStorageService.set("current_notification", notification);
        $state.go("app.detail_notification");
    }

})
