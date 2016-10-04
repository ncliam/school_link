/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.teacher', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('setting.teacher', {
          url: '/teacher',
          templateUrl: 'app/pages/setting/teacher/teacher.html',
          title: 'menu.setting.teacher',
          sidebarMeta: {
            order: 250,
          },
          controller: "TeacherCtrl"
        });
  }

})();
