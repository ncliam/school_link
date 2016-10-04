/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$Parent', Parent);

  /** @ngInject */
  function Parent ($request, $http, localStorageService) {
    var _self = this;
    this.fields = [
      "sale_order_count",
      "display_name",
      "name",
      "title",
      "parent_id",
      "street",
      "country_id",
      "email",
      "city",
      "street2",
      "color",
      "zip",
      "opportunity_count",
      "phone",
      "has_image",
      "state_id",
      "function",
      "is_company",
      "meeting_count",
      "mobile",
      "category_id",
      "children",
      "parent_user_id"
    ];
    this.domain = [];
    this.model = "res.partner";
    this.offset = 0;
    this.sort = "";
    this.limit = 2000;
    this.user = localStorageService.get("user");

    this.getAllParent = function(info, callbackSuccess, callbackError) {
      var path ="/api/search";
      var param = {
        model: _self.model,
        domain: [["customer", "=", true]],
        fields: info.fields || _self.fields,
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getAllChildrenOfSchool = function(info, callbackSuccess, callbackError) {
      var path ="/api/callKw";
      var param = {
        model: "res.users",
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"get_children",
        args: [_self.user.company_id]
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.searchParentByNameOrMobile = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: _self.model,
        domain: [["customer", "=", true], "|", ["name", "ilike", info.value], ["mobile", "ilike", info.value]],
        fields: info.fields || _self.fields,
        offset: info.offset || _self.offset,
        limit: info.limit || _self.limit,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid
      }
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getListParentByIds = function(info, callbackSuccess, callbackError){
      var path = "/api/callKw";
      var param = {
        model: _self.model,
        session_id: _self.user.session_id ,
        context: _self.user.context,
        sid: _self.user.sid,
        method:"read",
        args: [info.parent_ids, _self.fields]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    }

    this.createParent = function(info, callbackSuccess, callbackError){
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
          email: info.email || false,
          street: info.street || false,
          company_id: _self.user.company_id,
          active: true,
          customer: true,
          title: info.title || false,
          category_id: info.category_id
        }]
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
    
    this.updateParent = function(info, callbackSuccess, callbackError){
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
              mobile: info.mobile,
              email: info.email || false,
              street: info.street || false,
              category_id: info.category_id
            }
          ]
        };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.getListCategoryForParent = function(info, callbackSuccess, callbackError){
      var path ="/api/search";
      var param = {
        model: "res.partner.category",
        domain: [],
        fields: ["complete_name"],
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
