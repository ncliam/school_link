/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.schedule')
    .controller('ScheduleDetailCtrl', ScheduleDetailCtrl);

  /** @ngInject */
  function ScheduleDetailCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $uibModal, toastr, $Student, $Parent, $SchoolClass, $Teacher, 
    $SchoolSubject, $time, $Schedule) {
    localStorageService.get("chooseSchedule") ? $scope.schedule = localStorageService.get("chooseSchedule") :  $scope.schedule = {};
    $scope.listClass = [];
    $scope.listTeacher = [];
    $scope.listSubject = [];
    $scope.popup1 = {
      opened: false,
      date: new Date()
    };$scope.popup2 = {
      opened: false
    };$scope.popup3 = {
      opened: false
    };$scope.popup4 = {
      opened: false
    };
    $scope.backList = function(){
      $scope.show.list = true;
    }
    $scope.listSemester = [{id: 1, value:"first", name:"Học kì 1"}, {id: 2, value:"second", name:"Học kì 2"}];

    $scope.weekDay = [
      {
        id: 1,
        name: "Thứ 2",
        value: "mon"
      },{
        id: 2,
        name: "Thứ 3",
        value: "tue"
      },{
        id: 3,
        name: "Thứ 4",
        value: "wed"
      },{
        id: 4,
        name: "Thứ 5",
        value: "thu"
      },{
        id: 5,
        name: "Thứ 6",
        value: "fri"
      },{
        id: 6,
        name: "Thứ 7",
        value: "sat"
      },{
        id: 7,
        name: "Chủ nhật",
        value: "sun"
      }
    ];

    $scope.scheduleLineShow = {};
    $scope.listLine = [];
    $scope.scheduleLine = {};

    $scope.serialNumber = {};
    var _init = function(){
      $SchoolClass.getAllClass({}, function(result){
        $scope.listClass = result.records;
      }, function(error){});
      $Teacher.getAllTeacher({}, function(result){
        $scope.listTeacher = result.records;
      }, function(error){});
      $SchoolSubject.getAllSchoolSubject({}, function(result){
        $scope.listSubject = result.records;
      }, function(error){});
      if($scope.schedule.id){
        $scope.schedule.class_id = $scope.schedule.class_id[0];
        $scope.schedule.semester === "first" ? $scope.schedule.semester_id = $scope.listSemester[0].id : $scope.schedule.semester_id = $scope.listSemester[1].id;
        if($scope.schedule.lines.length > 0){
          $Schedule.getScheduleLine($scope.schedule, function(result){
            result.forEach(function(line){
              $scope.listLine.push({
                begin: line.begin,
                end: line.end,
                name: line.name,
                subject_id: line.subject_id[0],
                teacher_id: line.teacher_id[0],
                week_day: line.week_day,
                beginShow: moment(line.begin).format("HH:mm"),
                endShow: moment(line.end).format("HH:mm"),
                subjectShow: line.subject_id[1],
                teacherShow: line.teacher_id[1],
                id: line.id
              });
            });
            _renderLine();
          }, function(error){})
        }
      };
    };

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };$scope.open2 = function() {
      $scope.popup2.opened = true;
    };$scope.open3 = function() {
      $scope.popup3.opened = true;
    };$scope.open4 = function() {
      $scope.popup4.opened = true;
    };

    $scope.dateOptions = {
      dateDisabled: false,
      formatYear: 'yy',
      startingDay: 1,
      dateFormat: 'dd-MM-yyyy'
    };

    $scope.timepickerOptions = {
      readonlyInput: false,
      showMeridian: false
    }
    $scope.keySearch = {};
    $scope.listParentSearch = [];
    var modalCreateLine;
    $scope.chooseDay;

    _init();

    $scope.openPopupCreateLine = function (day, line) {
      if(line){
        $scope.scheduleLine.begin = new Date(line.begin);
        $scope.scheduleLine.end = new Date(line.end);
        $scope.scheduleLine.subject_id = line.subject_id;
        $scope.scheduleLine.teacher_id = line.teacher_id;
        $scope.scheduleLine.name = line.name;
      }
      $scope.scheduleLine.week_day = day;
      modalCreateLine = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/setting/schedule/widgets/popup.create.update.line.html",
        scope: $scope
      });
    };

    $scope.saveLine = function(action){
      var teacher = _.find($scope.listTeacher, function(tea){
        return tea.id === $scope.scheduleLine.teacher_id;
      });
      var subject = _.find($scope.listSubject, function(sub){
        return sub.id === $scope.scheduleLine.subject_id;
      });
      $scope.listLine.push({
        begin: _getDateForLine($scope.scheduleLine.week_day) + " " + moment($scope.scheduleLine.begin).format("HH:mm:ss"),
        end: _getDateForLine($scope.scheduleLine.week_day) + " " + moment($scope.scheduleLine.end).format("HH:mm:ss"),
        name: $scope.scheduleLine.name,
        subject_id: $scope.scheduleLine.subject_id,
        teacher_id: $scope.scheduleLine.teacher_id,
        week_day: $scope.scheduleLine.week_day.value,
        beginShow: moment($scope.scheduleLine.begin).format("HH:mm"),
        endShow: moment($scope.scheduleLine.end).format("HH:mm"),
        subjectShow: subject.name,
        teacherShow: teacher.name,
        edit: action === "edit" ? true : false,
        delete: action === "delete" ? true : false
      });
      modalCreateLine.dismiss('cancel');
      _renderLine();
      $scope.scheduleLine = {};
    };

    var _renderLine = function(){
      $scope.scheduleLineShow = _.groupBy($scope.listLine, function(line){
        return line.week_day;
      });
    }

    var _getDateForLine = function(day){
      var date;
      if(day.value === "mon"){
        date = moment().day("Monday");
      } else if(day.value === "tue"){
        date = moment().day("Tuesday");
      }else if(day.value === "tue"){
        date = moment().day("Tuesday");
      }else if(day.value === "wed"){
        date = moment().day("Wednesday");
      }else if(day.value === "thu"){
        date = moment().day("Thursday");
      }else if(day.value === "fri"){
        date = moment().day("Friday");
      }else if(day.value === "sat"){
        date = moment().day("Saturday");
      }else if(day.value === "sun"){
        date = moment().day("Sunday");
      }
      return moment(date).format("YYYY/MM/DD");
    }
    var _validate = function(){
      var flag = true;
      if(!$scope.schedule.name || $scope.schedule.name.length === 0){
        flag = false;
        toastr.error("Tên học sinh không được để trống", "", {});
      }
      return flag;
    };

    $scope.saveSchedule = function(){
      if($scope.schedule.id){
        _updateSchedule();
      } else{
        _createSchedule();
      }
    };

    var _createSchedule = function(){
      $scope.schedule.lines = [];
      $scope.listLine.forEach(function(line){
        $scope.schedule.lines.push([0, false, line]);
      });
      $scope.schedule.semester_id == 1 ? $scope.schedule.semester = "first" : $scope.schedule.semester = "second";
      $Schedule.createSchedule($scope.schedule, function(result){

      }, function(error){})
    };

    var _updateSchedule = function(){
      $scope.schedule.lines = [];
      $scope.listLine.forEach(function(line){
        if(!line.id){
          $scope.schedule.lines.push([0, false, line]);
        } else{
          if(line.delete){
            $scope.schedule.lines.push([2, line.id, false]);
          } else{
            if(line.edit){
              $scope.schedule.lines.push([1, line.id, line]);
            } else{
              $scope.schedule.lines.push([4, line.id, false]);
            }
          }
        }
      });
      $Schedule.updateSchedule($scope.schedule, function(result){

      }, function(error){});
    }

  }

})();
