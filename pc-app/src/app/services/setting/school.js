/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$School', School);

  /** @ngInject */
  function School($request, $http, localStorageService) {
    var _self = this;
    this.fields = [
      "name",
      "group_id",
      "year_id",
      "company_id"
    ];
    this.domain = [];
    this.model = "res.company";
    this.offset = 0;
    this.sort = "";
    this.limit = 2000;
    this.user = localStorageService.get("user");

    this.getAllSchool = function(info, callbackSuccess, callbackError) {
      var path ="/api/search";
      var param = {
        model: _self.model,
        domain: info.domain || _self.domain,
        fields: info.fields || _self.fields,
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.createClass = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"create",
        args: [{
          name: info.name,
          group_id: info.group_id,
          year_id: info.year_id,
          company_id: _self.user.company_id,
          student_ids: [6, false, info.student_ids]
        }]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
    
    this.updateClass = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
        var param = {
          model: _self.model,
          context: _self.user.context,
          sid: _self.user.sid,
          method:"write",
          args: [
            [info.id],
            {
              name: info.name
            }
          ]
        };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.selectSchool = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: "res.users",
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"select_school",
        args: [1]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    }

  }
})();
