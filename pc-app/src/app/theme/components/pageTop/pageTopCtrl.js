/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .controller('PageTopCtrl', PageTopCtrl);

  /** @ngInject */
  function PageTopCtrl($scope, $account, $state, localStorageService, $Imchat, $resUser, $uibModal, $Error, toastr, $request) {
    $scope.user = localStorageService.get("user");
    $scope.logout = function(){
      $Imchat.updateStatusUser({id:$scope.user.presense_id ,status: "offline"}, function(result){
        $account.logout({}, function(success){
          $scope.user.login = false;
          localStorageService.set("user", $scope.user);
          $state.go("login");
        }, 
        function(error){
          $Error.callbackError(error);
        }); 
      },
      function(error){
        $Error.callbackError(error);
      });
    };
    $scope.openChangePassword = function(){
      $uibModal.open({
        animation: true,
        templateUrl: "app/theme/components/pageTop/popup.change.password.html",
        controller: 'PageTopCtrl',
        scope: $scope
      });
    };

    $scope.changePassword = function(){
      if(_validate()){
        var info = {
          old_passwd: $scope.user.old_passwd,
          new_passwd: $scope.user.new_passwd
        }
        $resUser.changePassword(info, function(success){
          $scope.$dismiss();
          toastr.success("Đổi mật khẩu thành công", "", {});
          $scope.user.login = false;
          localStorageService.set("user", $scope.user);
          $state.go("login");
        }, function(error){
          toastr.error("Đổi mật khẩu không thành công", "", {});
          $Error.callbackError(error);
        });
      }
    };

    var _validate = function(){
      var flag = true;
      if($scope.user.password !== $scope.user.old_passwd){
        toastr.error("Mật khẩu cũ không chính xác", "", {});
        flag = false;
      }
      if($scope.user.new_passwd !== $scope.user.confirm_new_passwd){
        toastr.error("Mật khẩu mới không trùng nhau", "", {});
        flag = false;
      }
      return flag;
    }


  }
})();