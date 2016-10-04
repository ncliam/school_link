/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.schedule', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('setting.schedule', {
        url: '/schedule',
        abstract: true,
        template: '<ui-view></ui-view>',
        title: 'menu.setting.schedule',
        sidebarMeta: {
          order: 100,
        }
      }).state('setting.schedule.list', {
        url: '/list',
        templateUrl: 'app/pages/setting/schedule/list/schedule.list.html',
        title: 'List receipt',
        controller: "ScheduleListCtrl",
        controllerAs: "listCtrl"
      }).state('setting.schedule.detail', {
        url: '/detail',
        templateUrl: 'app/pages/setting/schedule/detail/schedule.detail.html',
        title: 'Detail receipt',
        controller: "ScheduleDetailCtrl",
        controllerAs: "detailCtrl"
      })
      $urlRouterProvider.when('/setting/schedule','/setting/schedule/list');
  }

})();
