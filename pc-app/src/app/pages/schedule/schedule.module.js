/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.schedule', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('schedule', {
        url: '/schedule',
        /*abstract: true,*/
        templateUrl: 'app/pages/schedule/schedule.html',
        title: 'menu.setting.schedule',
        sidebarMeta: {
          order: 50,
          icon: 'ion-compose'
        },
        controller: "ScheduleCtrl"
      })/*.state('schedule.list', {
        url: '/list',
        templateUrl: 'app/pages/setting/schedule/list/schedule.list.html',
        title: 'List receipt',
        controller: "ScheduleListCtrl",
        controllerAs: "listCtrl"
      }).state('schedule.detail', {
        url: '/detail',
        templateUrl: 'app/pages/setting/schedule/detail/schedule.detail.html',
        title: 'Detail receipt',
        controller: "ScheduleDetailCtrl",
        controllerAs: "detailCtrl"
      })
      $urlRouterProvider.when('/schedule','/schedule/list');*/
  }

})();
