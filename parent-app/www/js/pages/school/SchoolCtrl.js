/* global angular, document, window */
'use strict';

angular.module('starter.controllers')
.controller('SchoolCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $state, SchoolService, localStorageService, 
  $pouchDb, $resUser) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.$parent.hideMenuRightButton();
    
    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    $scope.schoolList = [];
    var userInfo = localStorageService.get("user");
    SchoolService.getSchoolAndChild({userInfo:userInfo}).then(function(response){
      console.log('response::::',response);
      if(response && response.status){
        $scope.schoolList = response.data;
        $timeout(function() {
          ionicMaterialMotion.fadeSlideIn({
              selector: '.animate-fade-slide-in .item'
          });
        }, 200);
      }
    });

    $scope.gotoMessage = function(school){
      SchoolService.selectSchool({schoolId:school.id, userInfo:userInfo}).then(function(result){
        console.log('selectSchoolResult ', result);
        if(result.status){
          $resUser.getStudentById({student_ids: [school.childrents[0].id]}, function(success){
            localStorageService.set("children", school.childrents[0]);
            localStorageService.set("class", success[0].class_ids);
            _updateChildrenForUser(school.childrents[0]);
            $state.go("app.message");
          }, function(error){})
        }
      })
    };

    var _updateChildrenForUser = function(children, class_ids){
      $pouchDb.getDocById("res.user", userInfo.username).then(function(userLc){
        userLc.data.children = children;
        userLc.data.class = class_ids;
        $pouchDb.updateDoc("res.user", userLc).then(function(result){
        });
      });
    }
})
