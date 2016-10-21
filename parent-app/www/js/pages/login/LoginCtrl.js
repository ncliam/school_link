/* global angular, document, window */
'use strict';

angular.module('starter.controllers')
.controller('LoginCtrl', function($scope,$state, $timeout, $stateParams, ionicMaterialInk, $LoginService, $Imchat, $Longpolling, localStorageService, 
  $resUser, toaster, $pouchDb) {
    $scope.$parent.clearFabs();
    $scope.$parent.hideMenuRightButton();
    $scope.$parent.hideTabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();

    $scope.user = {
      email: "",
      password: ""
    };
    $scope.form = "login";

    $scope.doLogin = function(){
    	localStorageService.remove("user");
      var info = {
        username:$scope.user.email,
        password: $scope.user.password
      }
      $LoginService.login(info, function(success){
        info.uid = success.uid;
        info.company_id = success.company_id;
        info.session_id = success.session_id;
        info.context = success.user_context;
        info.context.company_id = info.company_id;
        info.sid = success.sid;
        info.login = true;
        localStorageService.set("user", info);
        _setUserForService(info);
        $state.go("app.school");
        _initDatabaseLocalForUser();
        $Imchat.getPresenseByUserId({}, function(result){
          info.presense_id = result.records[0].id;
          localStorageService.set("user", info);
          $Imchat.updateStatusUser({id:info.presense_id ,status: "online"}, function(result){}, function(error){});
        }, function(error){$Error.callbackError(error);})
        if(!localStorageService.get("doPoll")){
          $Longpolling.poll();
        }
        //window.plugins.OneSignal.deleteTag("user_id");
        window.plugins.OneSignal.sendTag("user_id", info.uid);

      }, function(error){
        toaster.pop('error', "", "Sai tài khoản hoặc mật khẩu");
        //$Error.callbackError(error);
      });
    };

    // init database local for user
    var _initDatabaseLocalForUser = function(){
      _initDatabaseUser();
    };

    var _initDatabaseUser = function(){
      var userCurrent = localStorageService.get("user");
      $pouchDb.getAllDocs("res.user").then(function(allUser){
        var existUser = _.find(allUser, function(user){
          return user._id === userCurrent.username;
        });
        if(!existUser){
          var newUser = [{
            _id: userCurrent.username,
            data: userCurrent
          }];
          $pouchDb.bulkDocs("res.user", newUser).then(function(result){
            if(result){
              
            }
          });
        } else{
          existUser.data = userCurrent;
          $pouchDb.updateDoc("res.user", existUser).then(function(result){
            if(result){

            }
          });
        }
      });
    };

    var _setUserForService = function(user){
      $LoginService.user = user;
      $Imchat.user = user;
      $resUser.user = user;
      $Longpolling.user = user;
      $Longpolling.last = 0;
    };

    var token_id;

    $scope.doRegister = function(){
      $LoginService.register({mobile: $scope.user.mobile}, function(result){
        toaster.pop('success', "", "Vui lòng đợi tin nhắn trong giây lát");
        $scope.form= "confirm";
        token_id = result;
      }, function(error){});
    };
    $scope.confirmCode = function(){
      if(_validate()){
        var info = {
          mobile: $scope.user.mobile,
          token_id: token_id || 2,
          typing_code: $scope.user.code,
          password: $scope.user.password_register
        };
        $LoginService.confirmCode(info, function(result){
          toaster.pop('success', "", "Đăng ký thành công");
          $scope.form= "login";
        }, function(error){
          toaster.pop('error', "", "Sai mã xác nhận");
        });
      }
    };
    $scope.doForget = function(){
      $LoginService.forgetPassword({mobile: $scope.user.mobile}, function(result){
        toaster.pop('success', "", "Vui lòng đợi tin nhắn trong giây lát");
        $scope.form= "confirmForget";
        token_id = result;
      }, function(error){});
    };
    $scope.confirmForget = function(){
      if(_validate()){
        var info = {
          mobile: $scope.user.mobile,
          token_id: token_id || 2,
          typing_code: $scope.user.code,
          password: $scope.user.password_register
        };
        $LoginService.confirmForget(info, function(result){
          toaster.pop('success', "", "Đổi mật khẩu thành công");
          $scope.form= "login";
        }, function(error){
          toaster.pop('error', "", "Sai mã xác nhận");
        });
      }
    };

    $scope.goToRegister = function(){
      $scope.form= "register";

    };
    $scope.goToForget = function(){
      $scope.form= "forget";

    };
    var _validate = function(){
      var flag = true;
      if($scope.user.password_register !== $scope.user.passwordConfirm){
        flag = false;
        toaster.pop('error', "", "Mật khẩu phải giống nhau");
      }
      return flag;
    }
});

