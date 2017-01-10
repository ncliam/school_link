/**
 * @author v.lugovsky
 * created on 15.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service', [
  ])
  .run(runFunction)
  .config(config)
  .constant('SERVICE_API_URL', 'http://117.4.242.84:3003/api/callKw')
  .constant('SERVICE_API_URL_LOGIN', 'http://117.4.242.84:3003/api/login')
  .constant('SERVICE_API_URL_SEARCH', 'http://117.4.242.84:3003/api/search');
  function runFunction($http){
    /*var user= {
      username: "admin",
      password: "123456"
    }
    $account.login(user, function(result){
      $product.getAlltProduct({}, function(result){

      }, function(err){

      })
    }, function(err){

    })*/
  };
  function config(){
  }
})();
