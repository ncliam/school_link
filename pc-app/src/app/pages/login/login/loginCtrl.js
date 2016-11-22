/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.login')
    .controller('LoginCtrl', LoginCtrl);

  /** @ngInject */
  function LoginCtrl($scope, $rootScope, $state, localStorageService, toastr, $translate, $account, $pouchDb, $Schoolarity, $SchoolSubject, $SchoolClassGroup, $Parent, $SchoolClass,
    $School, $Student, $Teacher, $resUser, $Longpolling, $ResGroup, $Schedule, $Exam, $Imchat, $Error, MultipleViewsManager) {
    $rootScope.$pageLogin = true;
    $scope.user = {
      email: "school",
      password: "school"
    };
    if(localStorageService.get("user")){
      var user = localStorageService.get("user");
      $scope.user.email = user.username;
      $scope.user.password = "";
    };
    $scope.form = "login";
    
    $scope.host = "";
    $scope.login = function(){
      localStorageService.remove("user");
      if($scope.host.length > 0 && $scope.showHost){
        localStorageService.set("host", $scope.host);
      } else{
        localStorageService.remove("host");
      }
      var info = {
        username:$scope.user.email,
        password: $scope.user.password
      }
      $account.login(info, function(success){
        info.uid = success.uid;
        info.company_id = success.company_id;
        info.session_id = success.session_id;
        info.context = success.user_context;
        info.context.company_id = info.company_id;
        info.sid = success.sid;
        info.login = true;
        localStorageService.set("user", info);
        _setUserForService(info);
        _initDatabaseLocalForUser(info);
        $rootScope.$pageLogin = false;
        toastr.success($translate.instant('login.success'), "", {});
        $Imchat.getPresenseByUserId({}, function(result){
          info.presense_id = result.records[0].id;
          localStorageService.set("user", info);
          $Imchat.updateStatusUser({id:info.presense_id ,status: "online"}, function(result){}, function(error){$Error.callbackError(error);});
        }, function(error){$Error.callbackError(error);})
        if(!localStorageService.get("doPoll")){
          $Longpolling.poll();
        }
        $resUser.checkGroupForUser({group_name: "school_link.group_school_admin"}, function(result){
          if(result){
            info.permission = 2;
            info.admin = true;
          } else{
            info.admin = false;
            info.permission = 1;
          }
          $resUser.checkGroupForUser({group_name: "school_link.group_school_teacher"}, function(result){
            if(result){
              info.teacher = true;
            } else{
              info.teacher = false;
            }
            localStorageService.set("user", info);
            $state.go("message");
            MultipleViewsManager.updateView("user");
          },function(error){
            $Error.callbackError(error);
          })
         
        }, function(error){$Error.callbackError(error);});

      }, function(error){
        toastr.error($translate.instant('login.error.body'), $translate.instant('login.error.title'), {});
        //$Error.callbackError(error);
      });
    };
    
    // init database local for user
    var _initDatabaseLocalForUser = function(userLogin){
      var user = $scope.user.email.split("@")[0];
      $pouchDb.initDB("res.user");
      var channelDataName = "channel" + userLogin.uid;
      $pouchDb.initDB(channelDataName);

      _initDatabaseUser();
    };

    var _initDatabaseUser = function(){
      var user = $scope.user.email.split("@")[0];
      $pouchDb.getAllDocs("res.user").then(function(allUser){
        var existUser = _.find(allUser, function(user){
          return user._id === user;
        });
        if(!existUser){
          var newUser = [{
            _id: user,
            fields: {
              name: user,
              email: $scope.user.email,
              password: $scope.user.password
            }
          }];
          $pouchDb.bulkDocs("res.user", newUser).then(function(result){});
        }
      });
    };

    $scope.gotoRegister = function(){
      $state.go("register")
    };

    var _setUserForService = function(user){
      $account.user = user;
      $resUser.user = user;
      $Schoolarity.user = user;
      $SchoolSubject.user = user;
      $SchoolClassGroup.user = user;
      $Parent.user = user;
      $Student.user = user;
      $School.user = user;
      $SchoolClass.user = user;
      $Teacher.user = user;
      $Schedule.user = user;
      $ResGroup.user = user;
      $Imchat.user = user;
      $Exam.user = user;
      $Longpolling.last = 0;
    };

    $scope.gotoForgetPass = function(){
      $scope.form = "forget";
      $scope.user.mobile = "";
      $scope.user.password_register = "";
      $scope.user.passwordConfirm = "";
      $scope.user.code = "";
    };
    var token_id;
    $scope.forgetPass = function(){
      $resUser.forgetPassword({mobile: $scope.user.mobile}, function(result){
        token_id = result;
        $scope.form = "confirm";
        toastr.success("Vui lòng đợi tin nhắn trong giây lát", "", {});
      }, function(error){
        toastr.error("", error.message, {});
      })
    };
    $scope.confirmPass = function(){
      if(_validate()){
        var info = {
          mobile: $scope.user.mobile,
          token_id: token_id || 2,
          typing_code: $scope.user.code,
          password: $scope.user.password_register
        };
        $resUser.confirmForget(info, function(result){
          toastr.success("Đổi mật khẩu thành công", "", {});
          $scope.form= "login";
        }, function(error){
          toastr.error("Sai mã xác nhận", "", {});
        });
      }
    };

    var _validate = function(){
      var flag = true;
      if($scope.user.password_register !== $scope.user.passwordConfirm){
        flag = false;
        toastr.error("Mật khẩu phải giống nhau", "", {});
      }
      return flag;
    }

  }

})();