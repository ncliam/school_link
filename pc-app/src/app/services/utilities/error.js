/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$Error', error);

  /** @ngInject */
  function error($request, $http, localStorageService, toastr, $translate) {
    var _self = this;
    this.callbackError = function(error){
      //console.log(error);
        toastr.error(error.message, "Lỗi", {});
    }
  }
})();
