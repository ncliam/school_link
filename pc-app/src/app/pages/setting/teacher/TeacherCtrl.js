/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.teacher')
    .controller('TeacherCtrl', TeacherCtrl);

  /** @ngInject */
  function TeacherCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $Schoolarity, $uibModal, $Parent, toastr, $Teacher, $resUser,
   $ResGroup, $Error) {
    $scope.listTeacher = [];
    $scope.teacher = {};
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
    var modalTeacher;

    var accessTeacher;

    var _init = function(){
    	$Teacher.getAllTeacher({}, function(result){
        $scope.listTeacher = result.records;
      }, function(error){$Error.callbackError(error);});

      $ResGroup.getAllGroup({}, function(result){
        accessTeacher = _.find(result.records, function(acce){
          return acce.name =="School Teacher";
        });
      }, function(error){
        $Error.callbackError(error);
      });
    };
    _init();

    $scope.openPopupTeacher = function () {
      modalTeacher = $uibModal.open({
        animation: true,
        size: "lg",
        templateUrl: "app/pages/setting/teacher/widgets/popup.create.update.teacher.html",
        scope: $scope
      });
    };

    $scope.editTeacher = function(teacher){
      $scope.teacher = JSON.parse(JSON.stringify(teacher));
      $scope.teacher.birthday = new Date($scope.teacher.birthday);
      $scope.openPopupTeacher();
    };

    $scope.acceptTeacher = function(){
      if(_validate()){
        if($scope.teacher.id){
          _updateTeacher();
        }else{
          _createTeacher();
        }
      }
    };

    var _updateTeacher = function(){
      $Teacher.updateTeacher($scope.teacher, function(result){
        toastr.success("Cập nhật giáo viên thành công", "", {});
        modalTeacher.dismiss('cancel');
        var existTeacher = _.find($scope.listTeacher, function(teac){
          return teac.id === $scope.teacher.id;
        });
        existTeacher.name = $scope.teacher.name;
        existTeacher.mobile = $scope.teacher.mobile;
        $scope.teacher = {};
      }, function(error){
        $Error.callbackError(error);
      });
    };
    var _createTeacher = function(){
      var info = {
        active:true,
        email:$scope.teacher.email,
        in_group_58:true,
        lang:"en_US",
        login:$scope.teacher.username,
        name:$scope.teacher.name,
        accessTeacher: accessTeacher
      };

      $resUser.createUser(info, function(result){
        $scope.teacher.user_id = result;
        if($scope.teacher.birthday){
          $scope.teacher.birthday = moment($scope.teacher).format("YYYY-MM-DD");
        }
        $Teacher.createTeacher($scope.teacher, function(result){
          toastr.success("Tạo giáo viên thành công", "", {});
          modalTeacher.dismiss('cancel');
          $scope.teacher.id = result;
          var newTeacher = JSON.parse(JSON.stringify($scope.teacher));
          $scope.listTeacher.unshift(newTeacher);
          $scope.teacher = {};
        }, function(error){
          $Error.callbackError(error);
        });
      }, function(error){
        $Error.callbackError(error);
      })

      
    };

    var _validate = function(){
      var flag = true;
      if(!$scope.teacher.name || $scope.teacher.name.length === 0){
        flag = false;
        toastr.error("Tên không được để trống", "", {});
      }
      if(!$scope.teacher.work_phone || $scope.teacher.work_phone.length === 0){
        flag = false;
        toastr.error("Số điện thoại không được để trống", "", {});
      }
      return flag;
    }
  }

})();
