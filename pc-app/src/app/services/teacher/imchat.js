/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$Imchat', Imchat);

  /** @ngInject */
  function Imchat($request, $http, localStorageService) {
    var _self = this;
    this.fields = [
      "uuid",
      "message_ids",
      "user_ids",
      "session_res_users_rel"
    ];
    this.fieldsMessega = [
      "create_date",
      "from_id",
      "to_id",
      "type",
      "message"
    ];
    this.domain = [];
    this.model = "im_chat.session";
    this.offset = 0;
    this.sort = "";
    this.limit = 2000;
    this.user = localStorageService.get("user");

    this.initImchat = function(info, callbackSuccess, callbackError){
      var path ="/api/init";
      var param = {
        sid: _self.user.sid
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getSessionById = function(info, callbackSuccess, callbackError){
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

    this.getSessionByIdUser = function(info, callbackSuccess, callbackError) {
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"session_get",
        args: [info.id]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.createChannel = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"create",
        args: [{
          user_ids: [[6, 0, info.user_ids]]
        }]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.addUserToChannel = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"add_user",
        args: [info.uuid, info.user_id],
        kwargs:{}
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.updateState = function(info, callbackSuccess, callbackError) {
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"update_state",
        args: [],
        kwargs:{
          state:"open",
          uuid: info.uuid
        }
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.updateStateToClose = function(info, callbackSuccess, callbackError) {
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"update_state",
        args: [],
        kwargs:{
          state:"closed",
          uuid: info.uuid
        }
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getHistoryByUuid = function(info, callbackSuccess, callbackError){
      var path ="/api/history";
      var param = {
        uuid: info.uuid,
        limit: 100,
        sid: _self.user.sid
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.postMessage = function(info, callbackSuccess, callbackError){
      var path ="/api/post";
      var param = {
        uuid: info.uuid,
        message_content: info.message,
        sid: _self.user.sid,
        to_users: info.to_users || [],
        from_user: info.from_user
      };
      $request.pollRequest(path, param, callbackSuccess, callbackError);
    };

    this.postMessageDelay = function(info, callbackSuccess, callbackError){
      var path ="/api/postDelay";
      var param = {
        uuid: info.uuid,
        message_content: info.message,
        sid: _self.user.sid,
        to_users: info.to_users || [],
        from_user: info.from_user,
        delayTime: info.delayTime
      };
      $request.pollRequest(path, param, callbackSuccess, callbackError);
    };

    this.getAllMessageByUuid = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: _self.model,
        domain: [["uuid", "=", info.uuid]],
        fields: info.fields || _self.fields,
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.updateStatusUser = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: "im_chat.presence",
        context: _self.user.context,
        sid: _self.user.sid,
        method:"write",
        args: [
          [info.id],
          {
            status: info.status
          }
        ]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getPresenseByUserId = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: "im_chat.presence",
        domain: [["user_id", "=", _self.user.uid]],
        fields: ["user_id", "last_poll", "last_presence", "status"],
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    }
/*
    this.getMessageByUuid = function(info, callbackSuccess, callbackError){
      var path ="/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"im_chat.message",
        args: [_self.fields]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    }*/


  }
})();
