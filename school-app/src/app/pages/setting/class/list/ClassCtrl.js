/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.class')
    .controller('ClassListCtrl', ClassListCtrl);

  /** @ngInject */
  function ClassListCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $SchoolClass) {
    $scope.listClass = [];
    var _init = function(){
      $SchoolClass.getAllClass({}, function(result){
        $scope.listClass = result.records;
      }, function(error){})
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
  }

})();
