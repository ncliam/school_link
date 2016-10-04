/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .controller('PageTopCtrl', PageTopCtrl);

  /** @ngInject */
  function PageTopCtrl($scope, $account, $state, localStorageService, $Imchat, $resUser) {
    $scope.logout = function(){
      $scope.user = localStorageService.get("user");
      $Imchat.updateStatusUser({id:$scope.user.presense_id ,status: "offline"}, function(result){
        $account.logout({}, function(success){
          $scope.user.login = false;
          localStorageService.set("user", $scope.user);
          $state.go("login");
        }, 
        function(error){
        }); 
      },
      function(error){

      });
    }
  }
})();