/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$SchoolSubject', SchoolSubject);

  /** @ngInject */
  function SchoolSubject($request, $http, localStorageService) {
    var _self = this;
    this.fields = [
      "name",
      "weight",
      "sequence",
      "company_id"
    ];
    this.domain = [];
    this.model = "school.subject";
    this.offset = 0;
    this.sort = "";
    this.limit = 2000;
    this.user = localStorageService.get("user");

    this.getAllSchoolSubject = function(info, callbackSuccess, callbackError) {
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

    this.createSchoolSubject = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"create",
        args: [{
          name: info.name,
          sequence: info.sequence || 0,
          weight: info.weight || 0,
          company_id: _self.user.company_id
        }]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
    
    this.updateSchoolSubject = function(info, callbackSuccess, callbackError){
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
              weight: info.weight || 0
            }
          ]
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
    }

  }
})();
