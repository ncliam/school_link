/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$request', request);

  /** @ngInject */
  function request($http, cfpLoadingBar, localStorageService, usSpinnerService, $q) {
  	var _self = this;
    _self.host = "http://117.4.242.84";
    //_self.host = "http://127.0.0.1";
    _self.port= "3003";
    this.postRequest = function(path, param, callbackSuccess, callbackError){
      var host;
      if(localStorageService.get("host")){
       host = "http://" + localStorageService.get("host");
      } else{
        host = _self.host;
      }
      var url = host + ":" + _self.port + path;

      usSpinnerService.spin('loadingRequest');
      $http.post(url, param)
      .success(function(data) {
        if(!data.result){
          callbackSuccess(null);
        } else{
          if(data.result.error){
            callbackError(data.result);
          } else{
            callbackSuccess(data.result);
          }
        }
        usSpinnerService.stop('loadingRequest');
      })
      .error(function(err) {
        callbackError(err);
        usSpinnerService.stop('loadingRequest');
      });
    };

    this.pollRequest = function(path, param, callbackSuccess, callbackError){
      if(localStorageService.get("host")){
        _self.host = "http://" + localStorageService.get("host");
      }
      var url = _self.host + ":" + _self.port + path;
      $http.post(url, param)
      .success(function(data) {
        if(!data.result){
          callbackSuccess(null);
        } else{
          if(data.result.error){
            callbackError(data.error);
          } else{
            callbackSuccess(data.result);
          }
        }
      })
      .error(function(err) {
        callbackError(err);
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
