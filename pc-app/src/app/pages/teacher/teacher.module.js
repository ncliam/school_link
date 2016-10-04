/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.teacher', [
    'SchoolLink.pages.teacher.test'
    ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('teacher', {
        url: '/teacher',
        template : '<div ui-view></div>',
        abstract: true,
        title: 'menu.teacher',
        sidebarMeta: {
          icon: 'ion-compose',
          order: 150,
        },
      });
  }
})();
