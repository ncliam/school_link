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
          var start = new Date(dateStr);
          var end = new Date(dateStr);
          var week_arr = [];
          var start_day_of_week = new Date(start);
          start_day_of_week.setDate(start.getDate() - (start.getDay()-1));
          var end_day_of_week = new Date(end);
          end_day_of_week.setDate(end.getDate() + (7-end.getDay()));
          while (start_day_of_week.getTime()  < end_day_of_week.getTime() ) {
            var FirstDay = new Date(start_day_of_week);
            var LastDay = new Date(start_day_of_week);
            LastDay.setDate(start_day_of_week.getDate() + 6);
            start_day_of_week.setDate(start_day_of_week.getDate() + 7);
            var title =moment(FirstDay).format("DD/MM/YYYY") + " - "+ moment(LastDay).format("DD/MM/YYYY");
            week_arr.push({'first':FirstDay,'last':LastDay,'title':title})
           }
          return week_arr[0].title
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
