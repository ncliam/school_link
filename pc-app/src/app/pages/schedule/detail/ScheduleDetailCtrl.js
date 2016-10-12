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
    $SchoolSubject, $time, $Schedule, $Error, MultipleViewsManager) {
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
      MultipleViewsManager.updateView("reload_list_schedule");
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
      }
    ];
    $scope.listTietHoc = [
      {id: 1, name: "tiet1", display_name: "1", begin: "07:00:00", end: "07:45:00"},
      {id: 2, name: "tiet2", display_name: "2", begin: "07:50:00", end: "08:35:00"},
      {id: 3, name: "tiet3", display_name: "3", begin: "08:40:00", end: "09:25:00"},
      {id: 4, name: "tiet4", display_name: "4", begin: "09:30:00", end: "10:15:00"},
      {id: 5, name: "tiet5", display_name: "5", begin: "10:20:00", end: "11:05:00"},
      {id: 6, name: "tiet6", display_name: "6", begin: "11:10:00", end: "12:00:00"},
      {id: 7, name: "tiet7", display_name: "1", begin: "13:00:00", end: "13:45:00"},
      {id: 8, name: "tiet8", display_name: "2", begin: "13:50:00", end: "14:35:00"},
      {id: 9, name: "tiet9", display_name: "3", begin: "14:40:00", end: "15:25:00"},
      {id: 10, name: "tiet10", display_name: "4", begin: "15:30:00", end: "16:15:00"},
      {id: 11, name: "tiet11", display_name: "5", begin: "16:20:00", end: "17:05:00"},
      {id: 12, name: "tiet12", display_name: "6", begin: "17:10:00", end: "18:00:00"}
    ];

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
    };

    $scope.form = {
      first: true,
      second: true
    }

    $scope.showHideForm = function(form){
      $scope.form[form] = ! $scope.form[form];
    };

    $scope.scheduleLineShow = {};
    $scope.listLine = [];
    $scope.scheduleLine = {};

    $scope.serialNumber = {};
    var _init = function(){
      $scope.listTietHoc.forEach(function(tiethoc){
        $scope.weekDay.forEach(function(day){
          tiethoc[day.value] = {
            subjectShow: "",
            teacherShow: "",
            begin: _getDateForLine(day) + " " + tiethoc.begin,
            end: _getDateForLine(day) + " " + tiethoc.end,
            week_day: day.value,
            name: tiethoc.name
          }
        })
      });

      $SchoolClass.getAllClass({}, function(result){
        $scope.listClass = result.records;
      }, function(error){$Error.callbackError(error);});

      $Teacher.getAllTeacher({}, function(result){
        $scope.listTeacher = result.records;
      }, function(error){$Error.callbackError(error);});

      $SchoolSubject.getAllSchoolSubject({}, function(result){
        $scope.listSubject = result.records;
      }, function(error){$Error.callbackError(error);});

      if($scope.schedule.id){
        $scope.schedule.class_id = $scope.schedule.class_id[0];
        $scope.schedule.semester === "first" ? $scope.schedule.semester_id = $scope.listSemester[0].id : $scope.schedule.semester_id = $scope.listSemester[1].id;
        if($scope.schedule.lines.length > 0){
          $Schedule.getScheduleLine($scope.schedule, function(result){
            result.forEach(function(line){
              var existTiet = _.find($scope.listTietHoc, function(tiet){
                return tiet.name === line.name;
              });
              existTiet[line.week_day].subjectShow = line.subject_id[1];
              existTiet[line.week_day].teacherShow = line.teacher_id[1];
              existTiet[line.week_day].subject_id = line.subject_id[0];
              existTiet[line.week_day].teacher_id = line.teacher_id[0];
              existTiet[line.week_day].id = line.id;
              existTiet[line.week_day].name = existTiet.name;
             /* $scope.listLine.push({
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
              });*/
            });
            _renderLine();
          }, function(error){$Error.callbackError(error);})
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

    $scope.openPopupCreateLine = function (tiethoc, day) {
      $scope.scheduleLine.tiethoc = tiethoc;
      $scope.scheduleLine.day = day;
      $scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].teacher_id ? $scope.scheduleLine.teacher_id =  $scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].teacher_id : $scope.scheduleLine.teacher_id = null;
      $scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].subject_id ? $scope.scheduleLine.subject_id =  $scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].subject_id : $scope.scheduleLine.subject_id = null;
      modalCreateLine = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/schedule/widgets/popup.create.update.line.html",
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
      $scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].subjectShow = subject.name;
      $scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].teacherShow = teacher.name;
      $scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].subject_id = subject.id;
      $scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].teacher_id = teacher.id;
      if($scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].id){
        if(action ==="edit"){
          $scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].edit = true;
          $scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].delete = false;
        } else{
          $scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].delete = true;
          $scope.scheduleLine.tiethoc[$scope.scheduleLine.day.value].edit = false;
        }
      }
      modalCreateLine.dismiss('cancel');
      //_renderLine();
      $scope.scheduleLine = {};
    };

    var _renderLine = function(){
      $scope.scheduleLineShow = _.groupBy($scope.listLine, function(line){
        return line.week_day;
      });
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
       $scope.listTietHoc.forEach(function(tiethoc){
        $scope.weekDay.forEach(function(day){
          if(tiethoc[day.value].subject_id && tiethoc[day.value].teacher_id){
            $scope.schedule.lines.push([0, false, tiethoc[day.value]]);
          }
        });
      });
      $scope.schedule.semester_id == 1 ? $scope.schedule.semester = "first" : $scope.schedule.semester = "second";
      $Schedule.createSchedule($scope.schedule, function(result){
        toastr.success("Tạo thành công", "", {});
      }, function(error){$Error.callbackError(error);})
    };

    var _updateSchedule = function(){
      $scope.schedule.lines = [];
      $scope.listTietHoc.forEach(function(tiethoc){
        $scope.weekDay.forEach(function(day){
          if(tiethoc[day.value].id){
            if(tiethoc[day.value].delete){
              $scope.schedule.lines.push([2, tiethoc[day.value].id, false]);
            } else{
              if(tiethoc[day.value].edit){
                $scope.schedule.lines.push([1, tiethoc[day.value].id, tiethoc[day.value]]);
              } else{
                $scope.schedule.lines.push([4, tiethoc[day.value].id, false]);
              }
            }
          } else{
            if(tiethoc[day.value].subject_id && tiethoc[day.value].teacher_id){
              $scope.schedule.lines.push([0, false, tiethoc[day.value]]);
            }
          }
        });
      });
      $Schedule.updateSchedule($scope.schedule, function(result){
        toastr.success("Cập nhật thành công", "", {});
      }, function(error){$Error.callbackError(error);});
    }

  }

})();
