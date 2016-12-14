/* global angular, document, window */
'use strict';

angular.module('starter.controllers')
.controller('ScheduleCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, SchoolService, localStorageService, $translate) {
  $scope.$parent.hideHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = false;
  $scope.$parent.setExpanded(false);
  $scope.$parent.setHeaderFab(false);
  $scope.$parent.showMenuRightButton();
  $scope.$parent.showTabs();

  // Activate ink for controller
  ionicMaterialInk.displayEffect();

  var userInfo = localStorageService.get("user");
  $scope.tabName = "TKB";
  console.log('userInfo ', userInfo);
  $scope.groups = [];

  $scope.groups[0] = {
    name: 'mon',
    show: true
  };

  $scope.groups[1] = {
    name: 'tue',
    show: true
  };

  $scope.groups[2] = {
    name: 'wed',
    show: true
  };

  $scope.groups[3] = {
    name: 'thu',
    show: true
  };

  $scope.groups[4] = {
    name: 'fri',
    show: true
  };

  $scope.groups[5] = {
    name: 'sat',
    show: true
  };

  $scope.listSemester = [{id: 1, value:"first", name:$translate.instant('first')}, {id: 2, value:"second", name:$translate.instant('second')}];
  $scope.formData = {
    semester_id: 1
  }

  $scope.scheduleSchool = localStorageService.get('school.schedule');

  $scope.toggleGroup = function(group) {
    angular.forEach($scope.groups, function(value, key) {
      if (value.name == group) {
        value.show = !value.show;
      }
    });
  };

  $scope.changeSemester = function(){
    var semester;
    semester = $scope.formData.semester_id == 1? "first": "second";
    _getScheduleBySemester(semester);
  };

  $scope.isGroupShown = function(group) {

    var ret;

    angular.forEach($scope.groups, function(value, key) {

      if (value.name === group) {
        ret = value.show;
      }
    });

    return ret;
  };


  $scope.tkb = [];
  var _getScheduleBySemester = function(semester){
    $scope.tkb = [];
    SchoolService.getTKB({userInfo:userInfo, semester:semester}).then(function(result){
      if(result.status){
        $scope.tkb = result.data;
        $scope.tkb = _.sortBy($scope.tkb, function(day){
          return day.index;
        });
        /*$timeout(function() {
          ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
          });
        }, 200);*/
      }
    })
  };
  _getScheduleBySemester("first");
})
