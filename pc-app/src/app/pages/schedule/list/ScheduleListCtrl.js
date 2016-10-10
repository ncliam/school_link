/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.schedule')
    .controller('ScheduleListCtrl', ScheduleListCtrl);

  /** @ngInject */
  function ScheduleListCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $SchoolClass, $Schedule, $Error) {
  }

})();
