/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$Notification', Notification);

  /** @ngInject */
  function Notification($request, $http, localStorageService) {
    var _self = this;
    this.fields = [
      "uuid",
      "message_ids",
      "user_ids",
      "session_res_users_rel"
    ];
    this.domain = [];
    this.model = "mail.message";
    this.offset = 0;
    this.sort = "";
    this.limit = 2000;
    this.user = localStorageService.get("user");

    this.getNotification = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var context = _self.user.context;
      context.needaction_menu_ref = ["mail.mail_starfeeds", "mail.mail_inboxfeeds"];
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"message_read",
        args: [
          null, 
          [["partner_ids.user_ids", "in", [_self.user.uid]]],
          [],
          true,
          context,
          null,
          30
        ],
        kwargs: {}
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    }

  }
})();
