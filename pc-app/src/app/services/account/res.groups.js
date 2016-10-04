/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$ResGroup', ResGroup);

  /** @ngInject */
  function ResGroup($request, $http, localStorageService) {
    var _self = this;
    this.fields = [ 
      "name",
      "full_name",
      "group_id",
      "menu_access",
      "rule_groups",
      "model_access",
      "users"
    ];
    this.domain = [];
    this.model = "res.groups";
    this.offset = 0;
    this.sort = "";
    this.limit = 80;
    this.user = localStorageService.get("user");

    this.getAllGroup = function(info, callbackSuccess, callbackError){
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
    }

  }
})();
