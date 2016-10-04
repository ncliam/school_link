/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$model', model);

  /** @ngInject */
  function model() {
   	var _self = this;
   	_self.models = [
      {
        name: "product.product",
        fields: ["id", "name", "price", "image"]
      },{
        name: "pos.order",
        fields: ["id", "name", "total", "quantity"]
      }
   	]
  }
})();
