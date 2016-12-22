/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.test', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('test', {
          url: '/test',
          templateUrl: 'app/pages/test/test.html',
          title: 'menu.report',
          sidebarMeta: {
            order: 100,
            icon: 'ion-compose',
            permission: 1
          },
          controller: "TestCtrl"
        });
  }

})();
