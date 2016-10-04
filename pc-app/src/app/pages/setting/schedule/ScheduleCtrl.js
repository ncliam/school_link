/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.schedule')
    .controller('ScheduleCtrl', ScheduleCtrl);

  /** @ngInject */
  function ScheduleCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $Schoolarity, $uibModal, $Parent, toastr, $Teacher, $resUser, $ResGroup, $Schedule) {
    $scope.listSchedule = [];
    $scope.schedule = {};
    var allHistory;
    $scope.popup1 = {
      opened: false
    };$scope.popup2 = {
      opened: false
    };
    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };
    $scope.open2 = function() {
      $scope.popup2.opened = true;
    };
    $scope.dateOptionsReceipt = {
      dateDisabled: false,
      formatYear: 'yy',
      startingDay: 1,
      dateFormat: 'dd-MM-yyyy'
    };
    var modalSchedule;

    var accessSchedule;

    var _init = function(){
    	$Schedule.getAllSchedule({}, function(result){
        $scope.listSchedule = result.records;
      }, function(error){});
    };
    _init();

    $scope.openPopupSchedule = function () {
      modalSchedule = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/setting/schedule/widgets/popup.create.update.schedule.html",
        scope: $scope
      });
    };

    $scope.editSchedule = function(schedule){
      $scope.schedule = JSON.parse(JSON.stringify(schedule));
      $scope.schedule.birthday = new Date($scope.schedule.birthday);
      $scope.openPopupSchedule();
    };

    $scope.acceptSchedule = function(){
      if(_validate()){
        if($scope.schedule.id){
          _updateSchedule();
        }else{
          _createSchedule();
        }
      }
    };

    var _updateSchedule = function(){
      $Schedule.updateSchedule($scope.schedule, function(result){
        toastr.success("Cập nhật phụ huynh thành công", "", {});
        modalSchedule.dismiss('cancel');
        var existSchedule = _.find($scope.listSchedule, function(teac){
          return teac.id === $scope.schedule.id;
        });
        existSchedule.name = $scope.schedule.name;
        existSchedule.mobile = $scope.schedule.mobile;
        $scope.schedule = {};
      }, function(error){

      });
    };
    var _createSchedule = function(){
      $Schedule.createShedule($scope.schedule, function(result){
        toastr.success("Tạo phụ huynh thành công", "", {});
        modalSchedule.dismiss('cancel');
        $scope.schedule.id = result;
        var newSchedule = JSON.parse(JSON.stringify($scope.schedule));
        $scope.listSchedule.unshift(newSchedule);
        $scope.schedule = {};
      }, function(error){

      });

      
    };

    var _validate = function(){
      var flag = true;
      if(!$scope.schedule.name || $scope.schedule.name.length === 0){
        flag = false;
        toastr.error("Tên không được để trống", "", {});
      }
      if(!$scope.schedule.work_phone || $scope.schedule.work_phone.length === 0){
        flag = false;
        toastr.error("Số điện thoại không được để trống", "", {});
      }
      return flag;
    }
  }

})();
