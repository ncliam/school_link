/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.login')
    .controller('RegisterCtrl', RegisterCtrl);

  /** @ngInject */
  function RegisterCtrl($scope, $rootScope, $state) {
    $rootScope.$pageLogin = true;
  /*  $scope.registerAccout = function(){
      $rootScope.$pageLogin = false;
      $state.go("dashboard");
    };*/

    $scope.gotoLogin = function(){
      $state.go("login")
    }
  }

})();