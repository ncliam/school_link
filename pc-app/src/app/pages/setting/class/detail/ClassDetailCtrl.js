/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.class')
    .controller('ClassDetailCtrl', ClassDetailCtrl);

  /** @ngInject */
  function ClassDetailCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $uibModal, toastr, $SchoolClass, $Student, $Schoolarity, $SchoolClassGroup) {
    $scope.class = localStorageService.get("chooseClass");
    $scope.class.group_id = $scope.class.group_id[0];
    $scope.class.year_id = $scope.class.year_id[0];
    $scope.listStudent = [];
    var modalInstanceCreateLot;
    var chooseLine;
    $scope.popup1 = {
      opened: false
    };$scope.popup2 = {
      opened: false
    };$scope.popup3 = {
      opened: false
    };$scope.popup4 = {
      opened: false
    };
    var modalListStudent;

    $scope.serialNumber = {};
    var _init = function(){
      if($scope.class.student_ids.length > 0){
        $Student.getListStudentByIds($scope.class, function(result){
          $scope.listStudent =  result;
        }, function(error){
          
        });
      };
      $Schoolarity.getAllSchoolarity({}, function(result){
        $scope.listSchoolarity  = result.records;
      }, function(error){});
      $SchoolClassGroup.getAllClassGroup({}, function(result){
        $scope.listGroup  = result.records;
      }, function(error){});
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

    _init();

    $scope.updateClass = function(){
      if(_validate()){
        $scope.class.student_ids = [];
        $scope.listStudent.forEach(function(stu){
          $scope.class.student_ids.push(stu.id);
        })
        $SchoolClass.updateClass($scope.class, function(result){
          toastr.success("Cập nhật lớp học thành công", "", {});
          $state.go("setting.class.list");
        }, function(error){})
      }
    };

    var _validate = function(){
      var flag = true;
      if(!$scope.class.name || $scope.class.name.length === 0){
        toastr.success($translate.instant('name.require'), "", {});
        flag = false;
      }
      if(!$scope.class.group_id){
        toastr.success($translate.instant('group.require'), "", {});
        flag = false;
      }
      if(!$scope.class.group_id){
        toastr.success($translate.instant('year.require'), "", {});
        flag = false;
      }
       return flag;
    };

    $scope.startSearch = function(){
      $Student.searchStudentByName({value: $scope.keySearch.value}, function(result){
        $scope.listStudentSeach =  result.records;
        if($scope.listStudentSeach.length === 0){
          toastr.warning("Không tìm thấy học sinh nào", "", {});
        } else{
          $scope.listStudentSeach.forEach(function(stu){
            stu.birthday = moment(stu.birthday).format("DD-MM-YYYY");
          });
          if($scope.listStudentSeach.length === 1){
            $scope.addStudent($scope.listStudentSeach[0]);
          } else{
            $scope.openPopupListStudent();
          }
        }
      }, function(error){});
    };

    $scope.openPopupListStudent = function () {
      modalListStudent = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/setting/class/widgets/popup.list.student.html",
        scope: $scope
      });
    };

    $scope.addStudent = function(student){
      var existStudent = _.find($scope.listStudent, function(stu){
        return stu.id === student.id;
      });
      if(!existStudent){
        $scope.listStudent.unshift(student);
      }
      if(modalListStudent){
        modalListStudent.dismiss('cancel');
      }
    };

    $scope.removeLine = function(student){
      $scope.listStudent = _.reject($scope.listStudent, function(stu){
        return stu.id === student.id;
      });
    };

  }

})();
