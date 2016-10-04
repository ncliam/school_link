/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.group', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('setting.group', {
          url: '/group',
          templateUrl: 'app/pages/setting/groups/group.html',
          title: 'menu.setting.group',
          sidebarMeta: {
            order: 100,
          },
          controller: "GroupCtrl"
        });
  }

})();
