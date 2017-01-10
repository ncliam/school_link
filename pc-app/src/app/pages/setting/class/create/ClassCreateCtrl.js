/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.class')
    .controller('ClassCreateCtrl', ClassCreateCtrl);

  /** @ngInject */
  function ClassCreateCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $uibModal, toastr, $translate, $Schoolarity, $SchoolClassGroup, $SchoolClass, 
    $Student, $Parent, $Error, $Teacher) {
    $scope.class = {};
    $scope.listGroup = [];
    $scope.listSchoolarity =[];
    $scope.listTeacher =[];
    $scope.popup2 = {
      opened: false
    };
    $scope.open2 = function() {
      $scope.popup2.opened = true;
    };

    $scope.keySearch = {};

    $scope.dateOptions = {
      dateDisabled: false,
      formatYear: 'yy',
      minDate: new Date(),
      startingDay: 1,
      dateFormat: 'dd-MM-yyyy'
    };
    $scope.listStudent = [];
    $scope.listStudentSeach;
    var modalListStudent;
    var modalListStudentFileCsv;
    var modalConfirmSave;
    $scope.csv = {
      content: null,
      header: true,
      headerVisible: false,
      separator: ',',
      separatorVisible: false,
      result: null,
      encoding: 'UTF-8',
      encodingVisible: false,
    };

    $scope.read = function (workbook) {
      /* DO SOMETHING WITH workbook HERE */
      console.log(workbook);
    }

    $scope.error = function (e) {
      /* DO SOMETHING WHEN ERROR IS THROWN */
      console.log(e);
    }

    var _init = function(){
      $Schoolarity.getAllSchoolarity({}, function(result){
        $scope.listSchoolarity  = result.records;
      }, function(error){$Error.callbackError(error);});
      $SchoolClassGroup.getAllClassGroup({}, function(result){
        $scope.listGroup  = result.records;
      }, function(error){$Error.callbackError(error);});
      $Teacher.getAllTeacher({}, function(result){
        $scope.listTeacher = result.records;
      }, function(error){$Error.callbackError(error);});
    };
    _init();

    $scope.actionSave = function(){
      $scope.class.student_ids = [];
      $scope.listStudent.forEach(function(stu){
        $scope.class.student_ids.push(stu.id);
      })
      $SchoolClass.createClass($scope.class, function(result){
        toastr.success("Tạo lớp học thành công", "", {});
        $state.go("setting.class.list");
      }, function(error){$Error.callbackError(error);})
    }

    $scope.createClass = function(){
      if(_validate()){
        modalConfirmSave = $uibModal.open({
          animation: true,
          templateUrl: "app/pages/setting/class/widgets/popup.confrim.save.html",
          scope: $scope
        });
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
      }, function(error){$Error.callbackError(error);});
    };

    $scope.openPopupListStudent = function () {
      modalListStudent = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/setting/class/widgets/popup.list.student.html",
        scope: $scope
      });
    };

    $scope.openPopupListStudentFileCsv = function () {
      modalListStudentFileCsv = $uibModal.open({
        animation: true,
        size: "lg",
        templateUrl: "app/pages/setting/class/widgets/popup.csv.html",
        scope: $scope
      });
    };

    $scope.addStudent = function(student){
      var existStudent = _.find($scope.listStudent, function(stu){
        return stu.id === student.id;
      });
      if(!existStudent){
        student.birthday ? student.birthdayShow = student.birthday :student.birthdayShow = "";
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

    $scope.chooseFile = function () {
      console.log($scope.csv.result);
      $scope.openPopupListStudentFileCsv();
    };

    $scope.createListStudent = function(){
      var listParent = [];
      var listStudent = [];
      $scope.csv.result.forEach(function(line){
        if(line.parent_name && line.parent_name.length > 0){
          listParent.push({
            name: line.parent_name || false,
            mobile: line.parent_mobile || false,
            street: line.home_address || false,
            active: true,
            customer: true,
            index: line.index,
            email: false
          });
        }
        listStudent.push({
          index: line.index,
          name: line.name || false,
          last_name: line.last_name || false,
          home_town: line.home_town || false,
          home_address: line.home_address || false,
          birthday: line.birthday.length > 0 ? moment(line.birthday, 'DD-MM-YYYY').format('YYYY-MM-DD'): false,
          student: true/*,
          parent_ids: [[6, false, info.parent_ids]]*/
        });
      });
      $Parent.createListParent({listParent: listParent}, function(resultParent){
        for(var i = 0; i< listParent.length; i++){
          listParent[i].id = resultParent[i];
          var existStudent = _.find(listStudent, function(student){
            return student.index === listParent[i].index;
          });
          if(existStudent){
            existStudent.parent_ids = [[6, false, [listParent[i].id]]];
          }
        };
        $Student.createListStudent({listStudent: listStudent}, function(resultStudent){
          for(var i =0; i< listStudent.length; i++){
            listStudent[i].id = resultStudent[i];
          };
          $scope.listStudent = $scope.listStudent.concat(listStudent);
          modalListStudentFileCsv.dismiss('cancel');
        }, function(error){$Error.callbackError(error);});
      }, function(error){$Error.callbackError(error);});
    }
  }

})();
