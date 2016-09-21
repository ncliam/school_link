/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.scholarity')
    .controller('SchoolarityCtrl', SchoolarityCtrl);

  /** @ngInject */
  function SchoolarityCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $Schoolarity, $uibModal, $Parent) {
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
    var modalShoolarity;

    var _init = function(){
    	$Schoolarity.getAllSchoolarity({}, function(result){
        $scope.listSchoolarity  = result.records;
        $scope.listSchoolarity.forEach(function(schoolarity){
          schoolarity.date_start = moment(schoolarity.date_start).format("DD-MM-YYYY");
          schoolarity.date_end = moment(schoolarity.date_end).format("DD-MM-YYYY");
        })
      }, function(error){});
      $Parent.getAllChildrenOfSchool({}, function(result){}, function(error){});
    };
    _init();

    $scope.openPopupSchoolarity = function () {
      modalShoolarity = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/setting/schoolarity/widgets/popup.create.update.schoolarity.html",
        scope: $scope
      });
    };
  }

})();
