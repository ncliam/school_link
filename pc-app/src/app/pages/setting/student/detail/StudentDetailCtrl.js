/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.student')
    .controller('StudentDetailCtrl', StudentDetailCtrl);

  /** @ngInject */
  function StudentDetailCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $uibModal, toastr, $Student, $Parent) {
    localStorageService.get("chooseStudent") ? $scope.student = localStorageService.get("chooseStudent") :  $scope.student = {};
    $scope.student.birthday? $scope.student.birthday =  new Date($scope.student.birthday) : $scope.student.birthday = "";
    $scope.listParent = [];
    $scope.popup1 = {
      opened: false
    };$scope.popup2 = {
      opened: false
    };$scope.popup3 = {
      opened: false
    };$scope.popup4 = {
      opened: false
    };

    $scope.serialNumber = {};
    var _init = function(){
      if($scope.student.id && $scope.student.parent_ids.length > 0){
        $Parent.getListParentByIds($scope.student, function(result){
          $scope.listParent = result;
        }, function(error){})
      }
    };

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };$scope.open2 = function() {
      $scope.popup2.opened = true;
    };$scope.open3 = function() {
      $scope.popup3.opened = true;
    };$scope.open4 = function() {
      $scope.popup4.opened = true;
    };

    $scope.dateOptions = {
      dateDisabled: false,
      formatYear: 'yy',
      startingDay: 1,
      dateFormat: 'dd-MM-yyyy'
    };
    $scope.keySearch = {};
    $scope.listParentSearch = [];
    var modalListParent;

    _init();

    $scope.openPopupCreateParent = function(){

    };
    
    $scope.startSearch = function(){
      $Parent.searchParentByNameOrMobile({value: $scope.keySearch.value}, function(result){
        $scope.listParentSearch =  result.records;
        if($scope.listParentSearch.length === 0){
          toastr.warning("Không tìm thấy phụ huynh nào", "", {});
        } else{
          if($scope.listParentSearch.length === 1){
            $scope.addParent($scope.listParentSearch[0]);
          } else{
            $scope.openPopupListParent();
          }
        }
      }, function(error){});
    };

    $scope.openPopupListParent = function () {
      modalListParent = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/setting/student/widgets/popup.list.parent.html",
        scope: $scope
      });
    };

    $scope.addParent = function(parent){
      var existParent = _.find($scope.listParent, function(par){
        return par.id === parent.id;
      });
      if(!existParent){
        $scope.listParent.unshift(parent);
      }
      if(modalListParent){
        modalListParent.dismiss('cancel');
      }
    };

    $scope.saveStudent = function(){
      var info = JSON.parse(JSON.stringify($scope.student));
      if(info.birthday){
        info.birthday = moment(info.birthday).format("YYYY-MM-DD");
      }
      info.parent_ids = [];
      $scope.listParent.forEach(function(par){
        info.parent_ids.push(par.id);
      });
      if(_validate()){
        if($scope.student.id){
          _updateStudent(info);
        }else{
          _createStudent(info);
        }
      }
    };

    var _updateStudent = function(info){
      $Student.updateStudent(info, function(result){
        toastr.success("Cập nhật học sinh thành công", "", {});
        $state.go("setting.student.list");
      }, function(error){

      });
    };
    var _createStudent = function(info){
      $Student.createStudent(info, function(result){
        toastr.success("Tạo học sinh thành công", "", {});
        $state.go("setting.student.list");
      }, function(error){

      });
    };

    var _validate = function(){
      var flag = true;
      if(!$scope.student.name || $scope.student.name.length === 0){
        flag = false;
        toastr.error("Tên học sinh không được để trống", "", {});
      }
      return flag;
    };

    $scope.removeLine = function(parent){
      $scope.listParent = _.reject($scope.listParent, function(par){
        return par.id === parent.id;
      });
    };

  }

})();
