/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.parent', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('setting.parent', {
          url: '/parent',
          templateUrl: 'app/pages/setting/parent/parent.html',
          title: 'menu.setting.parent',
          sidebarMeta: {
            order: 200,
          },
          controller: "ParentCtrl"
        });
  }

})();
