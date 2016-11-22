/* global angular, document, window */
'use strict';

angular.module('starter.controllers')
.controller('SchoolCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $state, SchoolService, localStorageService, 
  $pouchDb, $resUser, MultipleViewsManager) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.$parent.hideMenuRightButton();
    
    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    $scope.schoolList = [];
    $scope.listChildren = [];
    var userInfo = localStorageService.get("user");
    SchoolService.getSchoolAndChild({userInfo:userInfo}).then(function(response){
      console.log('response::::',response);
      if(response && response.status){
        $scope.schoolList = response.data;
        $scope.schoolList.forEach(function(school){
          school.childrents.forEach(function(child){
            $scope.listChildren.push({children: child, school: school});
          })
        })
        /*$timeout(function() {
          ionicMaterialMotion.fadeSlideIn({
              selector: '.animate-fade-slide-in .item'
          });
        }, 200);*/
      }
    });

    $scope.gotoMessage = function(student){
      SchoolService.selectSchool({schoolId:student.school.id, userInfo:userInfo}).then(function(result){
        console.log('selectSchoolResult ', result);
        if(result.status){
          $resUser.getStudentById({student_ids: [student.children.id]}, function(success){
            localStorageService.set("children", student.children);
            localStorageService.set("class", success[0].class_ids);
            localStorageService.set("listChildren", $scope.listChildren);
            MultipleViewsManager.updateView("chooseChildren");
            _updateChildrenForUser(student.children, success[0].class_ids);
            $state.go("app.message");
          }, function(error){$Error.callbackError(error);})
        }
      })
    };

    var _updateChildrenForUser = function(children, class_ids){
      $pouchDb.getDocById("res.user", userInfo.username).then(function(userLc){
        userLc.data.children = children;
        userLc.data.listChildren = $scope.listChildren;
        userLc.data.class = class_ids;
        $pouchDb.updateDoc("res.user", userLc).then(function(result){
        });
      });
    }
})
