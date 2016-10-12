/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$SchoolClassGroup', SchoolClassGroup);

  /** @ngInject */
  function SchoolClassGroup($request, $http, localStorageService) {
    var _self = this;
    this.fields = [
      "name",
      "company_id"
    ];
    this.domain = [];
    this.model = "school.class.group";
    this.offset = 0;
    this.sort = "";
    this.limit = 2000;
    this.user = localStorageService.get("user");

    this.getAllClassGroup = function(info, callbackSuccess, callbackError) {
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

    this.createClassGroup = function(info, callbackSuccess, callbackError){
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
          company_id: _self.user.company_id
        }]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
    
    this.updateClassGroup = function(info, callbackSuccess, callbackError){
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
