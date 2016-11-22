/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$Error', error);

  /** @ngInject */
  function error($request, $http, localStorageService, toaster, $translate) {
    var _self = this;
    this.callbackError = function(error){
      //console.log(error);
      toaster.pop('error', "Lỗi", error.message);
    }
  }
})();
