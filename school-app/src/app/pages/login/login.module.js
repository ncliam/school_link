
/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.login', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        title: 'Login',
        templateUrl: 'app/pages/login/login/login.html',
        controller: 'LoginCtrl',
      })
      .state('register', {
        url: '/register',
        title: 'Register',
        templateUrl: 'app/pages/login/register/register.html',
        controller: 'RegisterCtrl',
      });
    }

})();
