/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.class')
    .controller('ClassListCtrl', ClassListCtrl);

  /** @ngInject */
  function ClassListCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $SchoolClass, $uibModal, toastr, $Error) {
    $scope.listClass = [];
    var tmpClass;
    var modalConfirmRemove;
    var _init = function(){
      $SchoolClass.getAllClass({}, function(result){
        $scope.listClass = result.records;
      }, function(error){$Error.callbackError(error);})
    };
    _init();
    
    $scope.gotoDetailClass = function(chooseClass){
    	localStorageService.set("chooseClass", chooseClass);
    	$state.go("setting.class.detail");
    };

    $scope.goToCreateClass = function(){
      localStorageService.remove("chooseReceipt");
      $state.go('setting.class.create');
    };

    $scope.confirmRemove = function(chooseClass){
      tmpClass = chooseClass;
      modalConfirmRemove = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/setting/class/widgets/popup.confrim.remove.html",
        scope: $scope
      });
    };

    $scope.removeRecords = function(){
      $SchoolClass.removeRecords(tmpClass, function(result){
        toastr.success("Xóa thành công", "", {});
        _init();
        modalConfirmRemove.dismiss('cancel');
      }, function(error){$Error.callbackError(error);})
    }
  }

})();
