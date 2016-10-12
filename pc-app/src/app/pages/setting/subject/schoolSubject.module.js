/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.schoolsubject', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('setting.schoolsubject', {
          url: '/schoolsubject',
          templateUrl: 'app/pages/setting/subject/schoolsubject.html',
          title: 'menu.setting.schoolsubject',
          sidebarMeta: {
            order: 100,
          },
          controller: "SchoolSubjectCtrl"
        });
  }

})();
