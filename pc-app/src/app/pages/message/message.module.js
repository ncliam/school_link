/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.message', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('message', {
          url: '/message',
          templateUrl: 'app/pages/message/message.html',
          title: 'Tin nhắn',
          sidebarMeta: {
            icon: 'ion-android-home',
            order: 0,
          },
          controller: "MessageCtrl",
        });
  }

})();
