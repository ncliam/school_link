/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$request', request);

  /** @ngInject */
  function request($http, cfpLoadingBar, localStorageService ) {
  	var _self = this;
    _self.host = "http://52.24.18.179";
    _self.port= "3003";
    _self.dbName = "thuong";
    this.postRequest = function(path, param, callbackSuccess, callbackError){
      if(localStorageService.get("host")){
        _self.host = "http://" + localStorageService.get("host");
      }
      var url = _self.host + ":" + _self.port + path;
      cfpLoadingBar.start();
      $http.post(url, param)
      .success(function(data) {
        if(data.error){
          callbackError(data.error);
        } else{
          callbackSuccess(data.result);
        }
        cfpLoadingBar.complete();
      })
      .error(function(err) {
        callbackError(err);
        cfpLoadingBar.complete();
      });
    };

    this.getRequest = function(path, param, callbackSuccess, callbackError){
      var url = _self.host + ":" + _self.port + path;
      $http.post(url,  param)
      .success(function(data) {
        callbackSuccess(data);
      })
      .error(function(err) {
        callbackError(err);
      });
    };

    this.putRequest = function(path, param, callbackSuccess, callbackError){
      var url = _self.host + ":" + _self.port + path;


      var req = {
        method: 'PUT',
        url: url,
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        data: param
      }
      _self.sendRequest(req, callbackSuccess, callbackError);
    };

		this.deleteRequest = function(path, param, callbackSuccess, callbackError){
	    var url = _self.host + ":" + _self.port + path;
	    var req = {
	      method: 'DELETE',
	      url: url,
	      headers: {
	         'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
	      },
	      data: param
	    }
	    _self.sendRequest(req, callbackSuccess, callbackError);
	  };
  }
})();
