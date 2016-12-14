/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.schedule')
    .controller('ScheduleCtrl', ScheduleCtrl);

  /** @ngInject */
  function ScheduleCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $SchoolClass, $Schedule, MultipleViewsManager, $uibModal, toastr, $Error) {
    $scope.listSchedule = [];
    var listSchedule = [];
    $scope.dateOptionsReceipt = {
      dateDisabled: false,
      formatYear: 'yy',
      startingDay: 1,
      dateFormat: 'dd-MM-yyyy'
    };
    $scope.show = {list: true};
    var modalConfirmRemove;

    var _init = function(){
      $Schedule.getAllSchedule({}, function(result){
        $scope.listSchedule = result.records;
        listSchedule = JSON.parse(JSON.stringify($scope.listSchedule));
      }, function(error){$Error.callbackError(error);});
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
    var tmpSchedule;
    $scope.confirmRemove = function(schedule){
      tmpSchedule = schedule;
      modalConfirmRemove = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/schedule/widgets/popup.confrim.remove.html",
        scope: $scope
      });
    };

    $scope.removeRecords = function(){
      $Schedule.removeRecords(tmpSchedule, function(result){
        toastr.success("Xóa thành công", "", {});
        _init();
        modalConfirmRemove.dismiss('cancel');
      }, function(error){$Error.callbackError(error);})
    };
    $scope.form = {};
    $scope.searchSchedule = function(){
      if($scope.form.search.length > 0){
        var search = _bodauTiengViet($scope.form.search);
        $scope.listSchedule = _.filter(listSchedule, function(schedule) {
          return _bodauTiengViet(schedule.class_id[1]).toUpperCase().indexOf(search.toUpperCase()) >=0 
        });
      } else{
        $scope.listSchedule = listSchedule;
      }
    };


    var  _bodauTiengViet = function(str) {  
      if(str){
        str= str.toLowerCase();  
        str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");  
        str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");  
        str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");  
        str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");  
        str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");  
        str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");  
        str= str.replace(/đ/g,"d");  
        return str;  
      } else{
        return "";
      }
    };
  }

})();
