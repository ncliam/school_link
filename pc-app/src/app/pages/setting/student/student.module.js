/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.student', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('setting.student', {
        url: '/student',
        abstract: true,
        template: '<ui-view></ui-view>',
        title: 'menu.setting.student',
        sidebarMeta: {
          order: 200,
        }
      }).state('setting.student.list', {
        url: '/list',
        templateUrl: 'app/pages/setting/student/list/student.list.html',
        title: 'List receipt',
        controller: "StudentListCtrl",
        controllerAs: "listCtrl"
      }).state('setting.student.detail', {
        url: '/detail',
        templateUrl: 'app/pages/setting/student/detail/student.detail.html',
        title: 'Detail receipt',
        controller: "StudentDetailCtrl",
        controllerAs: "detailCtrl"
      });
      $urlRouterProvider.when('/setting/student','/setting/student/list');
  }

})();
