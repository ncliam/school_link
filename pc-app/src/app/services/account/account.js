/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$account', account);

  /** @ngInject */
  function account($request, $http, localStorageService) {
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

    this.getCompanyById = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: "res.company",
        domain: [["id", "=", info.id]],
        fields: ["name"],
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    }
  }
})();
