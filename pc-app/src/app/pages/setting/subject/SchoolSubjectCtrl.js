/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.schoolsubject')
    .controller('SchoolSubjectCtrl', SchoolSubjectCtrl);

  /** @ngInject */
  function SchoolSubjectCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $SchoolSubject, $uibModal, toastr, $translate, $Error) {
    $scope.listSubject = [];
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
    	$SchoolSubject.getAllSchoolSubject({}, function(result){
        $scope.listSubject  = result.records;
      }, function(error){$Error.callbackError(error);})
    };
    _init();

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
    $scope.acceptSubject = function(){
      if(_validate()){
        if($scope.subject.id){
          _updateSubject();
        }else{
          _createSubject();
        }
      }
    };

    var _updateSubject = function(){
      $SchoolSubject.updateSchoolSubject($scope.subject, function(result){
        toastr.success($translate.instant('schoolsubject.update.success'), "", {});
        modalShoolSubject.dismiss('cancel');
        var existSubject = _.find($scope.listSubject, function(sub){
          return sub.id === $scope.subject.id;
        });
        existSubject.name = $scope.subject.name;
        existSubject.weight = $scope.subject.weight;
        $scope.subject = {};
      }, function(error){
        $Error.callbackError(error);
      });
    };
    var _createSubject = function(){
      $SchoolSubject.createSchoolSubject($scope.subject, function(result){
        toastr.success($translate.instant('schoolsubject.create.success'), "", {});
        modalShoolSubject.dismiss('cancel');
        $scope.subject.id = result;
        var newSubject = JSON.parse(JSON.stringify($scope.subject));
        $scope.listSubject.unshift(newSubject);
        $scope.subject = {};
      }, function(error){
        $Error.callbackError(error);
      });
    };

    var _validate = function(){
      var flag = true;
      if(!$scope.subject.name || $scope.subject.name.length === 0){
        flag = false;
        toastr.error($translate.instant('schoolsubject.name.require'), "", {});
      }
      return flag;
    }
  }

})();
