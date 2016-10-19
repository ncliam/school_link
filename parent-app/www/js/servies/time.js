/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$time', time);

  /** @ngInject */
  function time() {
    this.start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.end = new Date();
    var _sefl = this;
    this.getWeek = function(){
      var start = _sefl.start;
      var end = _sefl.end;
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
        var title = "Tuần: " + moment(FirstDay).format("DD-MM-YYYY") + " - "+ moment(LastDay).format("DD-MM-YYYY");
        week_arr.push({'first':FirstDay,'last':LastDay,'title':title})
       }
      return week_arr
    };
    this.getMonths = function(){
      var start = _sefl.start;
      var end = _sefl.end;
      var mon_arr = []
      var m = start.getMonth();
      var y = start.getFullYear()

      while ( (y < end.getFullYear()) ||  (y == end.getFullYear() && m <= end.getMonth())) {
        var FirstDay = new Date(y, m, 1);
        var LastDay = new Date(y, m + 1, 0);
        if (m == 11) {
            y +=1
        }
        m = (m+1)%12
        mon_arr.push({'first':FirstDay,'last':LastDay,'title':"Tháng " + (FirstDay.getMonth() +1)+" năm "+FirstDay.getFullYear()})
      }
      return mon_arr
    };

    this.getPrevDate = function(date){
      var prevDate =""; 
      prevDate = moment(date).add('days', -1);
      prevDate = moment(prevDate).format("YYYY-MM-DD");
      return prevDate;
    };

    this.getNextDate = function(date){
      var nextDate =""; 
      nextDate = moment(date).add('days', 1);
      nextDate = moment(nextDate).format("YYYY-MM-DD");
      return nextDate;
    };

    this.getPrevWeek = function(week){
      var prevWeek = {};
      prevWeek.first = moment(week.first).add('days', -7);
      prevWeek.first = moment(prevWeek.first).format("YYYY-MM-DD");
      prevWeek.last = moment(week.last).add('days', -7);
      prevWeek.last = moment(prevWeek.last).format("YYYY-MM-DD");
      return prevWeek;
    };

    this.getNextWeek = function(week){
      var nextWeek = {};
      nextWeek.first = moment(week.first).add('days', 7);
      nextWeek.first = moment(nextWeek.first).format("YYYY-MM-DD");
      nextWeek.last = moment(week.last).add('days', 7);
      nextWeek.last = moment(nextWeek.last).format("YYYY-MM-DD");
      return nextWeek;
    };

    this.getPrevMonth = function(month){
      var prevMonth = {};
      prevMonth.first = new Date(month.first);
      var currentMonth = prevMonth.first.getMonth();
      var currentYear = prevMonth.first.getFullYear();
      var firstDayOfPrevMonth = new Date(currentYear, currentMonth - 1, 1);
      var lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0);
      prevMonth.first = moment(firstDayOfPrevMonth).format("YYYY-MM-DD");
      prevMonth.last = moment(lastDayOfPrevMonth).format("YYYY-MM-DD");
      return prevMonth;
    };

    this.getNextMonth = function(month){
      var nextMonth = {};
      nextMonth.first = new Date(month.first);
      var currentMonth = nextMonth.first.getMonth();
      var currentYear = nextMonth.first.getFullYear();
      var firstDayOfNextMonth = new Date(currentYear, currentMonth + 1, 1);
      var lastDayOfNextMonth = new Date(currentYear, currentMonth + 2, 0);
      nextMonth.first = moment(firstDayOfNextMonth).format("YYYY-MM-DD");
      nextMonth.last = moment(lastDayOfNextMonth).format("YYYY-MM-DD");
      return nextMonth;
    };

    this.getMondayOfWeek = function(day){
      d = new Date(d);
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    }

  }
})();
