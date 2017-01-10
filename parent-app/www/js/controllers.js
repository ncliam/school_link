/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, $state, $LoginService, localStorageService, $pouchDb, MultipleViewsManager,
 SchoolService, $resUser, $Notification, $Imchat) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
    $scope.show = {menu:true};
    $scope.numberMessage = 0;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.hideMenuRightButton = function() {
        var fabs = document.getElementsByClassName('ion-navicon-round');
        for(var i = 0; i< fabs.length; i++){
            fabs[i].style.display = 'none';
        }
    };

    $scope.showMenuRightButton = function() {
        var fabs = document.getElementsByClassName('ion-navicon-round');
        for(var i = 0; i< fabs.length; i++){
            fabs[i].style.display = 'block';
        }
    };
     $scope.hideTabs = function() {
        document.getElementsByClassName('tabs-icon-top')[0].style.display = 'none';
    };

    $scope.showTabs = function() {
        document.getElementsByClassName('tabs-icon-top')[0].style.display = 'inline-flex';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.isActiveTab = function(tabName){
      // console.log('check tab ', tabName);
      return $state.is(tabName);
    }

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    $scope.logout = function(){
        $scope.user = localStorageService.get("user");
        $scope.user.login = false;
        localStorageService.remove("partner_user");
        localStorageService.set("user", $scope.user);
        _updateUserLc();
        $pouchDb.destroyDatabase("channels");
        $LoginService.logout({}, function(result){
        }, function(error){});
        $state.go("app.login");
    };

    var _updateUserLc = function(){
      $pouchDb.getDocById("res.user", $scope.user.username).then(function(userLc){
        userLc.data.login = false;
        $pouchDb.updateDoc("res.user", userLc).then(function(result){
        });
      });
    }

    MultipleViewsManager.updated('chooseChildren', function (data) {
        $scope.children = localStorageService.get("children")
        $scope.listChildren = localStorageService.get("listChildren");
    });
    MultipleViewsManager.updated('notification_new_message', function (data) {
      _getMessageToRead();
    });
    MultipleViewsManager.updated('notification', function (data) {
         _getNotificationToRead();
    });
    MultipleViewsManager.updated('getInfoForUser', function (data) {
      if(localStorageService.get('partner_user')){
        $scope.partner_user = localStorageService.get('partner_user');
      } else{
        _getInfoForUser();
      }
    });
    $scope.gotoMessage = function(){
        $scope.numberMessage = 0;
        $state.go("app.message");
    }
    $scope.chooseChildren = function(student){
        $scope.user = localStorageService.get("user");
        $scope.show.menu = true;
        SchoolService.selectSchool({schoolId:student.school.id, userInfo:$scope.user}).then(function(result){
            console.log('selectSchoolResult ', result);
            if(result.status){
              $resUser.getStudentById({student_ids: [student.children.id]}, function(success){
                localStorageService.set("children", student.children);
                $scope.children = localStorageService.get("children")
                localStorageService.set("class", success[0].class_ids);
                _updateChildrenForUser(student.children, success[0].class_ids);

                $state.go("app.notification");
              }, function(error){})
            }
          })
    };
    var _updateChildrenForUser = function(children, class_ids){
      $pouchDb.getDocById("res.user", $scope.user.username).then(function(userLc){
        userLc.data.children = children;
        userLc.data.listChildren = $scope.listChildren;
        userLc.data.class = class_ids;
        $pouchDb.updateDoc("res.user", userLc).then(function(result){
        });
      });
    };

    var _getNotificationToRead = function(){
      if(localStorageService.get("user")){
        $Notification.getNotificationToRead({}, function(result){
          $scope.numberNotification = result.length;
        }, function(error){

        })
      }
    };
    var _getMessageToRead = function(){
      $scope.numberMessage = 0;
      $Imchat.initImchat({}, function(result){
        $scope.listChannel = _.reject(result, function(channel){
          return channel[1].type;
        });
        $scope.listChannelLocal = localStorageService.get("channels");
        $scope.listChannel.forEach(function(channel){
          if($scope.listChannelLocal[channel[1].uuid]){
            if($scope.listChannelLocal[channel[1].uuid].numberNotifi){
                $scope.numberMessage += $scope.listChannelLocal[channel[1].uuid].numberNotifi;
            }
          }
        })
      }, function(error){

      });
    };

    var _getInfoForUser = function(){
      $scope.user = localStorageService.get("user") ;
      $resUser.getUserById({id: localStorageService.get("user").uid}, function(user){
        $resUser.getPartnerById({id:user.records[0].partner_id[0]}, function(partner){
          $scope.partner_user = partner;
          localStorageService.set("partner_user", partner);
        }, function(error){});
      }, function(error){});
    }

    if(localStorageService.get("user") && localStorageService.get("user").sid){
      $scope.user = localStorageService.get("user") ;
      _getInfoForUser();
      _getMessageToRead();
      _getNotificationToRead();
    }

})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

;
