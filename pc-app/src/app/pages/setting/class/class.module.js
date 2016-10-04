/**
 * @author k.danovsky
 * created on 15.01.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.class', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('setting.class', {
        url: '/class',
        abstract: true,
        template: '<ui-view></ui-view>',
        title: 'menu.setting.class',
        sidebarMeta: {
          order: 150,
        }
      }).state('setting.class.list', {
        url: '/list',
        templateUrl: 'app/pages/setting/class/list/class.list.html',
        title: 'List receipt',
        controller: "ClassListCtrl",
        controllerAs: "listCtrl"
      }).state('setting.class.detail', {
        url: '/detail',
        templateUrl: 'app/pages/setting/class/detail/class.detail.html',
        title: 'Detail receipt',
        controller: "ClassDetailCtrl",
        controllerAs: "detailCtrl"
      }).state('setting.class.create', {
        url: '/create',
        templateUrl: 'app/pages/setting/class/create/class.create.html',
        title: 'Create receipt',
        controller: "ClassCreateCtrl",
        controllerAs: "detailCtrl"
      });
      $urlRouterProvider.when('/setting/class','/setting/class/list');
  }
})();
