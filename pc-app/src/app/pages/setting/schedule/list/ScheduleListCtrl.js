/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.schedule')
    .controller('ScheduleListCtrl', ScheduleListCtrl);

  /** @ngInject */
  function ScheduleListCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $SchoolClass, $Schedule) {
    $scope.listSchedule = [];
    $scope.dateOptionsReceipt = {
      dateDisabled: false,
      formatYear: 'yy',
      startingDay: 1,
      dateFormat: 'dd-MM-yyyy'
    };
    var modalShoolSubject;

    var _init = function(){
      $Schedule.getAllSchedule({}, function(result){
        $scope.listSchedule = result.records;
      }, function(error){});
    };
    _init();

     $scope.gotoDetailSchedule = function(schedule){
      if(schedule){
        localStorageService.set("chooseSchedule", schedule);
      } else{
        localStorageService.remove("chooseSchedule");
      }
      $state.go("setting.schedule.detail");
    };
  }

})();
