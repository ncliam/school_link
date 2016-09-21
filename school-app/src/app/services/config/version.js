/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$version', version);

  /** @ngInject */
  function version() {
   	var _self = this;
   	_self.number = "1.0.1";
  }
})();
