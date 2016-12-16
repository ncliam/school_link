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
      var context = JSON.parse(JSON.stringify(_self.user.context));
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

    this.getNotificationToRead = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var context = JSON.parse(JSON.stringify(localStorageService.get("user").context));
      context.needaction_menu_ref = ["mail.mail_starfeeds", "mail.mail_inboxfeeds"];
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"message_read",
        args: [
          null, 
          [
            ["partner_ids.user_ids", "in", [_self.user.uid]],
            ["to_read", "=", true]
          ],
          [],
          true,
          context,
          null,
          30
        ],
        kwargs: {}
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.readNotification = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"set_message_read",
        args: [
          [info.id],
          true,
          false,
          {
            default_model:"res.partner",
            default_res_id:info.default_res_id,
            mail_read_set_read:true
          }
        ],
        kwargs: {}
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getResPartnerById = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: "res.partner",
        domain: [["id", "=", info.id]],
        fields: ["message_follower_ids"],
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.readFollowData = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: "res.partner",
        session_id: _self.user.session_id ,
        sid: _self.user.sid,
        method:"read_followers_data",
        args: [
          info.message_follower_ids
        ],
        kwargs: {}
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    }

  }
})();
