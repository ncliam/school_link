/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting', [
      'SchoolLink.pages.setting.scholarity',
      'SchoolLink.pages.setting.schoolsubject',
      'SchoolLink.pages.setting.group',
      'SchoolLink.pages.setting.class',
      'SchoolLink.pages.setting.student',
      'SchoolLink.pages.setting.parent',
      'SchoolLink.pages.setting.teacher'
    ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('setting', {
        url: '/setting',
        template : '<div ui-view></div>',
        abstract: true,
        title: 'menu.setting',
        sidebarMeta: {
          icon: 'ion-compose',
          order: 100,
        },
      });
  }
})();
