(function () {
    'use strict';

    angular
        .module('SchoolLink.service')
        .factory('UtilService', Service);

    function Service($http, $q) {
        var service = {};

        service.convertDayToThu = ConvertDayToThu;
        service.getDayWeekTitle = GetDayWeekTitle;
        return service;

        function ConvertDayToThu(val) {
          switch (val.toLowerCase()) {
            case 'mon':
              return 2;
              break;
            case 'tue':
              return 3;
              break;
            case 'wed':
              return 4;
              break;
            case 'thu':
              return 5;
              break;
            case 'fri':
              return 6;
              break;
            case 'sat':
              return 7;
              break;
            case 'sun':
              return 1;
              break;
            default:
              return val;
              break;
          }
        }

        function GetDayWeekTitle( dateStr ) {
          var s = dateStr.replace(/[ :]/g, "-").split("-");
          var date = new Date( s[0], s[1], s[2], s[3], s[4], s[5] );
          var day = date.getDay() || 7;
          if( day !== 1 )
            date.setHours(-24 * (day - 1));

        	var dayStartWeek =  date.getDate();
          var dayEndWeek = new Date(date.setHours(24 * 6));

          return dayStartWeek + "-" + dayEndWeek.getDate() + "/" + (dayEndWeek.getMonth() + 1) + "/" + dayEndWeek.getFullYear();
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
