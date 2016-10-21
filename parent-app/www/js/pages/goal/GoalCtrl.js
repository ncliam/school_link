/* global angular, document, window */
'use strict';

angular.module('starter.controllers')
.controller('GoalCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, SchoolService, localStorageService) {
    $scope.$parent.hideHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.$parent.showMenuRightButton();
    $scope.$parent.showTabs();

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
    $scope.markType = "w1";
    var userInfo = localStorageService.get("user");
    $scope.markList = [];
    var markListLocal =[];
    $scope.markListByType = [];
    $scope.markTB;
    $scope.markHK;
    $scope.markHL;
    $scope.listSemester = [{id: 1, value:"first", name:"Học kì 1"}, {id: 2, value:"second", name:"Học kì 2"}];
    $scope.formData = {
      semester_id: 1
    }
    $scope.chooseTab = function(val){
      $scope.markListByType = [];
      $scope.markType = val;
      for(var i = 0; i < $scope.markList.length; i++){
        if($scope.markList[i].type == $scope.markType){
          $scope.markListByType.push($scope.markList[i]);
        }
      }
    };
    $scope.changeSemester = function(){
      $scope.markList = _.filter(markListLocal, function(mark) {
        return $scope.formData.semester_id == 1? mark.semester === "first": mark.semester === "second";
      });
      $scope.markTB = _.find($scope.markList, function(mark){
        return mark.type === "average";
      })
      $scope.markHK = _.find($scope.markList, function(mark){
        return mark.type === "conduct";
      })
      $scope.markHL = _.find($scope.markList, function(mark){
        return mark.type === "overall";
      });
      $scope.chooseTab($scope.markType);
    }
    var children = localStorageService.get("children");
    SchoolService.getKetQuaHoc({userInfo:userInfo, student_id: children.id}).then(function(result){
      if(result.status){
        console.log('dataaaa', result.data);
        markListLocal = JSON.parse(JSON.stringify(result.data));
        $scope.markList = _.filter(markListLocal, function(mark) {
          return mark.semester === "first";
        });
        $scope.markTB = _.find($scope.markList, function(mark){
          return mark.type === "average";
        })
        $scope.markHK = _.find($scope.markList, function(mark){
          return mark.type === "conduct";
        })
        $scope.markHL = _.find($scope.markList, function(mark){
          return mark.type === "overall";
        })
        $scope.chooseTab($scope.markType);

      }
      else {
        console.log('error ', result);
      }
    })
})
