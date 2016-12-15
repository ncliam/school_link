/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$SchoolClass', SchoolClass);

  /** @ngInject */
  function SchoolClass($request, $http, localStorageService) {
    var _self = this;
    this.fields = [
      "name",
      "group_id",
      "year_id",
      "company_id",
      "teacher_id",
      "student_ids",
      "display_name",
      "parent_ids",
      "teacher_ids"
    ];
    this.field_teacher = [
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
      "last_name",
      "work_phone",
      "user_id"
    ];
    this.field_parent = [
      "sale_order_count",
      "display_name",
      "name",
      "title",
      "parent_id",
      "street",
      "country_id",
      "email",
      "city",
      "street2",
      "color",
      "zip",
      "opportunity_count",
      "phone",
      "has_image",
      "state_id",
      "function",
      "is_company",
      "meeting_count",
      "mobile",
      "category_id",
      "children",
      "parent_user_id"
    ];
    this.domain = [];
    this.model = "school.class";
    this.offset = 0;
    this.sort = "";
    this.limit = 2000;
    this.user = localStorageService.get("user");

    this.getClassById = function(info, callbackSuccess, callbackError) {
       var path ="/api/search";
      var param = {
        model: _self.model,
        domain: [["id", "=", info.id]],
        fields: info.fields || _self.fields,
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
    this.getListTeacherByIds = function(info, callbackSuccess, callbackError){
      var path = "/api/callKw";
      var param = {
        model: "hr.employee",
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"read",
        args: [info.ids, _self.field_teacher]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getListParentByIds = function(info, callbackSuccess, callbackError){
      var path = "/api/callKw";
      var param = {
        model: "res.partner",
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"read",
        args: [info.parent_ids, _self.field_parent]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };


  }
})();
