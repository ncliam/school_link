/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$AccountJournal', AccountJournal);

  /** @ngInject */
  function AccountJournal($request, $http, localStorageService) {
    var _self = this;
    this.fields = [ 
      "code",
      "name",
      "type",
      "user_id",
      "company_id"
    ];
    this.domain = [];
    this.model = "account.journal";
    this.offset = 0;
    this.sort = "";
    this.limit = 80;
    this.user = localStorageService.get("user");

    this.getAllPaymentMethods = function(info, callbackSuccess, callbackError){
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
