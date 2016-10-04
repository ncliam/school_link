/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.scholarity', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('setting.scholarity', {
          url: '/scholarity',
          templateUrl: 'app/pages/setting/schoolarity/schoolarity.html',
          title: 'menu.setting.schoolarity',
          sidebarMeta: {
            order: 0,
          },
          controller: "SchoolarityCtrl"
        });
  }

})();
