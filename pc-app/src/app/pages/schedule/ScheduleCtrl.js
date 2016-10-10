/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.schedule')
    .controller('ScheduleCtrl', ScheduleCtrl);

  /** @ngInject */
  function ScheduleCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $SchoolClass, $Schedule, MultipleViewsManager) {
    $scope.listSchedule = [];
    $scope.dateOptionsReceipt = {
      dateDisabled: false,
      formatYear: 'yy',
      startingDay: 1,
      dateFormat: 'dd-MM-yyyy'
    };
    $scope.show = {list: true};
    var modalShoolSubject;

    var _init = function(){
      $Schedule.getAllSchedule({}, function(result){
        $scope.listSchedule = result.records;
      }, function(error){});
    };
    _init();

    MultipleViewsManager.updated('reload_list_schedule', function (data) {
      _init();
    })

     $scope.gotoDetailSchedule = function(schedule){
      if(schedule){
        localStorageService.set("chooseSchedule", schedule);
      } else{
        localStorageService.remove("chooseSchedule");
      }
      $scope.show.list = false;
    };
  }

})();
