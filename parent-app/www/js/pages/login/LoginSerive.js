/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$LoginService', LoginService);

  /** @ngInject */
  function LoginService($request, $http, localStorageService) {
    this.user = localStorageService.get("user");
    var _self = this;
    this.login = function(info, callbackSuccess, callbackError) {
      var path ="/api/login";
      var param = {
        username: info.username,
        password: info.password
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
    this.logout = function(info, callbackSuccess, callbackError) {
      var path ="/api/logout";
      var param = {
        context: _self.user.context,
        sid: _self.user.sid,
        session_id: _self.user.session_id
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.register = function(info, callbackSuccess, callbackError){
      var path ="/api/parent_registration";
      var param = {
        mobile: info.mobile
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
    
    this.confirmCode = function(info, callbackSuccess, callbackError){
      var path ="/api/parent_number_verify";
      var param = {
        mobile: info.mobile,
        token_id: info.token_id,
        typing_code: info.typing_code,
        password: info.password
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.forgetPassword = function(info, callbackSuccess, callbackError){
      var path ="/api/forgot_password_request";
      var param = {
        model: "res.partner",
        mobile: info.mobile
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
    
    this.confirmForget = function(info, callbackSuccess, callbackError){
      var path ="/api/forgot_password_verify";
      var param = {
        mobile: info.mobile,
        token_id: info.token_id,
        typing_code: info.typing_code,
        password: info.password
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };


  }
})();
