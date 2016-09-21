/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.teacher.test', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('teacher.test', {
          url: '/test',
          templateUrl: 'app/pages/teacher/test/test.html',
          title: 'menu.teacher.test',
          sidebarMeta: {
            order: 100,
          },
          controller: "TestCtrl"
        });
  }

})();
