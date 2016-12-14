/* global angular, document, window */
'use strict';

angular.module('starter.controllers')
.controller('DetailNotificationCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $Imchat, localStorageService, 
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
    $scope.notification = localStorageService.get("current_notification");

})
