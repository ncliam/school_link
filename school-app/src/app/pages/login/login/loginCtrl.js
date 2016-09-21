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
    $School, $Student, $Teacher, $resUser) {
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
    
    $scope.host = "";
    $scope.login = function(){
      localStorageService.remove("user");
      if($scope.host.length > 0){
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
        localStorageService.set("user", info);
        _setUserForService(info);
        _initDatabaseLocalForUser();
        $rootScope.$pageLogin = false;
        $state.go("setting.scholarity");
        toastr.success($translate.instant('login.success'), "", {});
        /*$report.getReportSaleDetail({date_start: "07/22/2016", date_end: "07/26/2016"}, function(success){

        }, function(error){

        });*/
      }, function(error){
        toastr.error($translate.instant('login.error.body'), $translate.instant('login.error.title'), {})
      });
    };
    
    // init database local for user
    var _initDatabaseLocalForUser = function(){
      var user = $scope.user.email.split("@")[0];
      $pouchDb.initDB("res.user");
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
    }

  }

})();