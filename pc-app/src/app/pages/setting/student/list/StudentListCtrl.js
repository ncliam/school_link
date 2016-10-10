/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.student')
    .controller('StudentListCtrl', StudentListCtrl);

  /** @ngInject */
  function StudentListCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $SchoolClass, $Student, $School, $Error) {
    $scope.listStudent = [];
    var allHistory;
    $scope.subject = {};
    $scope.dateOptionsReceipt = {
      dateDisabled: false,
      formatYear: 'yy',
      startingDay: 1,
      dateFormat: 'dd-MM-yyyy'
    };
    var modalShoolSubject;

    var _init = function(){
      $Student.getAllStudent({}, function(result){
        $scope.listStudent  = result.records;
        $scope.listStudent.forEach(function(stu){
          stu.birthday ? stu.birthdayFormat = moment(stu.birthday).format("DD-MM-YYYY") : stu.birthdayFormat = false;
        })
      }, function(error){$Error.callbackError(error);});

      $School.selectSchool({}, function(result){}, function(error){$Error.callbackError(error);})
    };
    _init();

     $scope.gotoDetailStudent = function(student){
      if(student){
        localStorageService.set("chooseStudent", student);
      } else{
        localStorageService.remove("chooseStudent");
      }
      $state.go("setting.student.detail");
    };

    $scope.openPopupSchoolarity = function () {
      modalShoolSubject = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/setting/subject/widgets/popup.create.update.subject.html",
        scope: $scope
      });
    };

    $scope.editSubject = function(subject){
      $scope.subject = JSON.parse(JSON.stringify(subject));
      $scope.openPopupSchoolarity();
    };
  }

})();
