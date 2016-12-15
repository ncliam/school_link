/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.notification', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('notification', {
        url: '/notification',
        /*abstract: true,*/
        templateUrl: 'app/pages/notification/notification.html',
        title: 'menu.setting.notification',
        sidebarMeta: {
          order: 50,
          icon: 'ion-android-notifications',
          permission: 2
        },
        controller: "NotificationCtrl"
      })
  }

})();
