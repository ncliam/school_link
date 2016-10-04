/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.scholarity')
    .controller('SchoolarityCtrl', SchoolarityCtrl);

  /** @ngInject */
  function SchoolarityCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $Schoolarity, $uibModal, $Parent, $ResGroup, toastr, $resUser) {
    $scope.listSchoolarity = [];
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
    var modalSchoolarity;
    $scope.schoolarity = {};

    var _init = function(){
    	$Schoolarity.getAllSchoolarity({}, function(result){
        $scope.listSchoolarity  = result.records;
        $scope.listSchoolarity.forEach(function(schoolarity){
          schoolarity.date_start = moment(schoolarity.date_start).format("DD-MM-YYYY");
          schoolarity.date_end = moment(schoolarity.date_end).format("DD-MM-YYYY");
        })
      }, function(error){});
    };
    _init();

    $scope.openPopupSchoolarity = function () {
      modalSchoolarity = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/setting/schoolarity/widgets/popup.create.update.schoolarity.html",
        scope: $scope
      });
    };

    $scope.editSchoolarity = function(schoolarity){
      $scope.schoolarity = JSON.parse(JSON.stringify(schoolarity));
      $scope.openPopupSchoolarity();
    };

    $scope.acceptSchoolarity = function(){
      if(_validate()){
        if($scope.schoolarity.id){
          _updateSchoolarity();
        }else{
          _createSchoolarity();
        }
      }
    };

    var _updateSchoolarity = function(){
      $Schoolarity.updateParent($scope.schoolarity, function(result){
        toastr.success("Cập nhật phụ huynh thành công", "", {});
        modalSchoolarity.dismiss('cancel');
        var existSchoolarity = _.find($scope.listSchoolarity, function(par){
          return par.id === $scope.schoolarity.id;
        });
        existSchoolarity.name = $scope.schoolarity.name;
        existSchoolarity.mobile = $scope.schoolarity.mobile;
        $scope.schoolarity = {};
      }, function(error){

      });
    };
    var _createSchoolarity = function(){
      $Schoolarity.createSchoolarity($scope.schoolarity, function(result){
        toastr.success("Tạo phụ huynh thành công", "", {});
        modalSchoolarity.dismiss('cancel');
        $scope.schoolarity.id = result;
        var newSchoolarity = JSON.parse(JSON.stringify($scope.schoolarity));
        $scope.listSchoolarity.unshift(newSchoolarity);
        $scope.schoolarity = {};
      }, function(error){

      });
    };

    var _validate = function(){
      var flag = true;
      if(!$scope.schoolarity.name || $scope.schoolarity.name.length === 0){
        flag = false;
        toastr.error("Tên không được để trống", "", {});
      }
      return flag;
    }
  }

})();
