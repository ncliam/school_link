/**
 * @author v.lugovsky
 * created on 15.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service', [
    'ngCookies'
  ])
  .run(runFunction)
  .config(config);
  function runFunction($account, $http){
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
