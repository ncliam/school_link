/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$Schedule', Schedule);

  /** @ngInject */
  function Schedule($request, $http, localStorageService) {
    var _self = this;
    this.fields = [
      "name",
      "class_id",
      "semester",
      "lines"
    ];
    this.fieldsLine = [
      "name",
      "week_day",
      "teacher_id",
      "subject_id",
      "begin",
      "end"
    ];
    this.domain = [];
    this.model = "school.schedule";
    this.offset = 0;
    this.sort = "";
    this.limit = 2000;
    this.user = localStorageService.get("user");

    this.getAllSchedule = function(info, callbackSuccess, callbackError) {
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

    this.createSchedule = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"create",
        args: [{
          class_id: info.class_id,
          lines: info.lines,
          name: info.name,
          semester: info.semester
        }]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
    
    this.updateSchedule = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
        var param = {
          model: _self.model,
          context: _self.user.context,
          sid: _self.user.sid,
          method:"write",
          args: [
            [info.id],
            {
              class_id: info.class_id,
              lines: info.lines,
              name: info.name,
              semester: info.semester
            }
          ]
        };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getScheduleLine = function(info, callbackSuccess, callbackError){
      var path = "/api/callKw";
      var param = {
        model: "school.schedule.line",
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"read",
        args: [info.lines, _self.fieldsLine]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getScheduleByClass = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: _self.model,
        domain: [["class_id", "=", info.class_id]],
        fields: info.fields || _self.fields,
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getScheduleLineByClass = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: "school.schedule.line",
        domain: [["schedule_id.class_id", "=", info.class_id]],
        fields: _self.fieldsLine,
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
