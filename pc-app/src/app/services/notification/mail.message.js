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
      "no_auto_thread",
      "mail_server_id",
      "notify",
      "subject",
      "composition_mode",
      "attachment_ids",
      "is_log",
      "parent_id",
      "partner_ids",
      "res_id",
      "body",
      "model",
      "use_active_domain",
      "email_from",
      "reply_to",
      "template_id"
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
      context.needaction_menu_ref = ["mail.mail_starfeeds", "mail.mail_tomefeeds"];
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"message_read",
        args: [
          null, 
          [["to_read", "=", true], ["starred", "=", false]],
          [],
          true,
          context,
          null,
          50
        ],
        kwargs: {}
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.defaultGetNotification = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var context = JSON.parse(JSON.stringify(_self.user.context));
      context.default_model = "res.users";
      context.default_res_id = _self.user.uid;
      context.default_attachment_ids = [];
      context.default_body = "";
      context.default_body = "";
      context.default_parent_id = false;
      context.default_partner_ids = [];
      context.mail_post_autofollow = true;
      context.mail_post_autofollow_partner_ids = [];
      context.params = {};
      context.uid = _self.user.uid;
      var param = {
        model: "mail.compose.message",
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"default_get",
        args: [_self.fields],
        kwargs: {context: context}
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.createNotification = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var context = JSON.parse(JSON.stringify(_self.user.context));
      context.default_model = "res.users";
      context.default_res_id = _self.user.uid;
      context.default_attachment_ids = [];
      context.default_body = "";
      context.default_body = "";
      context.default_parent_id = false;
      context.default_partner_ids = [];
      context.mail_post_autofollow = true;
      context.mail_post_autofollow_partner_ids = [];
      context.params = {};
      context.uid = _self.user.uid;
      var param = {
        model: "mail.compose.message",
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"create",
        args: [{
          attachment_ids: info.attachment_ids,
          body: info.body,
          composition_mode: info.composition_mode,
          email_from: info.email_from || "admin@example.com",
          is_log: info.is_log || false,
          model: info.model,
          no_auto_thread:false,
          notify:false,
          parent_id: info.parent_id || false,
          partner_ids: [[6, false, info.user_ids]],
          reply_to:false,
          res_id: info.res_id,
          subject: info.subject,
          template_id: false,
          use_active_domain: false
        }],
        kwargs: {context: context}
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.sentNotifition = function(info, callbackSuccess, callbackError){
      var path = "/api/callButton";
      var param = {
        model: "mail.compose.message",
        sid: _self.user.sid,
        method:"send_mail",
        args: [[info.id],
          _self.user.context
        ]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.pushNotificationToOneSignal = function(info, callbackSuccess, callbackError){
      var path = "/api/push_notification";
      var param = {
        notification: info.notification,
        to_users: info.to_users
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    }
  }
})();
