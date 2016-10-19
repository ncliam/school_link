/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$Exam', exam);

  /** @ngInject */
  function exam($request, $http, localStorageService) {
    var _self = this;
    this.fields = [
      "name",
      "class_id",
      "teacher_id",
      "student_id",
      "date_exam",
      "subject_id",
      "weight",
      "semester",
      "sequence",
      "mark",
      "type"
    ];
    this.domain = [];
    this.model = "school.exam.move";
    this.offset = 0;
    this.sort = "";
    this.limit = 2000;
    this.user = localStorageService.get("user");

    this.getExam = function(info, callbackSuccess, callbackError) {
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

    this.getExamBySubjectAndSemester = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: _self.model,
        domain: [["subject_id", "=", info.subject_id], ["semester", "=", info.semester], ["class_id", "=", info.class_id]],
        fields: info.fields || _self.fields,
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
    this.getExamByTypes = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: _self.model,
        domain: [["semester", "=", info.semester], ["class_id", "=", info.class_id], ["type", "in", info.types]],
        fields: info.fields || _self.fields,
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
      
    this.getDefault = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"default_get",
        args: [_self.fields]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };


    this.createListExam = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"create_multi",
        args: [info.listExam]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
    this.updateListExam = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"write_multi",
        args: [info.listExam]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.createExam = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"create",
        args: [{
          name: info.name,
          mobile: info.mobile,
          company_id: _self.user.company_id,
          active: true,
          customer: true,
          title: info.title || false
        }]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.removeExam = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"unlink",
        args: [info.listId]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    }

  }
})();
