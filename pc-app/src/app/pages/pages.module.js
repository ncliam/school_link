/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',

    /*'BlurAdmin.pages.dashboard',*/
    /*'BlurAdmin.pages.ui',
    'BlurAdmin.pages.components',
    'BlurAdmin.pages.form',
    'BlurAdmin.pages.tables',
    'BlurAdmin.pages.charts',
    'BlurAdmin.pages.profile',*/
    'SchoolLink.pages.login',
    'SchoolLink.pages.setting',
    'BlurAdmin.pages.message',
    'SchoolLink.pages.schedule',
    'SchoolLink.pages.test',
    'SchoolLink.pages.notification'
  ])
      .config(routeConfig)
      .run(runConfig);
  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider, cfpLoadingBarProvider, $translateProvider, usSpinnerConfigProvider) {
    $urlRouterProvider.otherwise('/login');

    $translateProvider.useStaticFilesLoader({
      prefix: (function() {
        try {
          var rootPath  = require('app-root-path');
          var path = rootPath + '/app/locale/locale-';
          console.log(path);
          return path;
        } catch (ex) {
          return './app/locale/locale-'
        }
      })(),
      suffix: '.json'
    });
    $translateProvider.preferredLanguage('vi');
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar  = false;
    cfpLoadingBarProvider.spinnerColor = '#bd2c00';
    cfpLoadingBarProvider.barColor = '#bd2c00';
    usSpinnerConfigProvider.setTheme('blue', {color: 'blue', radius: 10});
  }

  function runConfig(localStorageService, $pouchDb){
    localStorageService.remove("doPoll");
  }

})();
