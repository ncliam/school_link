/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$Student', Student);

  /** @ngInject */
  function Student ($request, $http, localStorageService) {
    var _self = this;
    this.fields = [
      "message_follower_ids",
      "job_id",
      "message_is_follower",
      "last_login",
      "work_email",
      "work_location",
      "name",
      "message_ids",
      "login",
      "__last_update",
      "display_name",
      "birthday",
      "parent_ids",
      "parent_id",
      "home_town",
      "home_address",
      "last_name"
    ];
    this.domain = [];
    this.model = "hr.employee";
    this.offset = 0;
    this.sort = "";
    this.limit = 2000;
    this.user = localStorageService.get("user");

    this.getAllStudent = function(info, callbackSuccess, callbackError) {
      var path ="/api/search";
      var param = {
        model: _self.model,
        domain: [["student", "=", true]],
        fields: info.fields || _self.fields,
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.searchStudentByName = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: _self.model,
        domain: [["student", "=", true],["display_name", "ilike", info.value]],
        fields: info.fields || _self.fields,
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getListStudentByIds = function(info, callbackSuccess, callbackError){
      var path = "/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"read",
        args: [info.student_ids, _self.fields]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    }

    this.createStudent = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"create",
        args: [{
          name: info.name,
          last_name: info.last_name,
          home_town: info.home_town || "",
          home_address: info.home_address || "",
          birthday: info.birthday || false,
          student: true,
          parent_ids: [[6, false, info.parent_ids]]
        }]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
    
    this.updateStudent = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
        var param = {
          model: _self.model,
          context: _self.user.context,
          sid: _self.user.sid,
          method:"write",
          args: [
            [info.id],
            {
              name: info.name,
              last_name: info.last_name,
              home_town: info.home_town || "",
              home_address: info.home_address || "",
              birthday: info.birthday || false,
              parent_ids: [[6, false, info.parent_ids]]
            }
          ]
        };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.createListStudent = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"create_multi",
        args: [info.listStudent]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.removeRecords = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"unlink",
        args: [[info.id]]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

  }
})();
