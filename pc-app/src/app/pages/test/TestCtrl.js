/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.test')
    .controller('TestCtrl', TestCtrl);

  /** @ngInject */
  function TestCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $SchoolClassGroup, $uibModal, toastr, $translate, $SchoolClass, $SchoolSubject, 
    $Student, $Exam, $Error, $resUser) {
    $scope.listSemester = [{id: 1, value:"first", name:$translate.instant('first_semester')}, {id: 2, value:"second", name:$translate.instant('second_semester')}];
    var user = localStorageService.get("user");
    $scope.user = localStorageService.get("user");
    $scope.formData = {};
    $scope.listClass = [];
    $scope.listSubject = [];
    $scope.listMarkOne = {};
    $scope.listMarkTwo = {};
    $scope.listMarkHK = {};
    $scope.listMarkTB = {};
    $scope.listMarkHanhKiem = {};
    $scope.tab = "bd";
    $scope.listMarkHL = {};
    var listExamCreate = [];
    var listExamUpdate = [];
    var listExamDelete = [];
    var teacher_id;
    var listStudentLocal = [];
    var _init = function(){
      $SchoolClass.getAllClass({}, function(result){
        $scope.listClass = result.records;
      }, function(error){$Error.callbackError(error);});
     
      /*$SchoolSubject.getAllSchoolSubject({}, function(result){
        $scope.listSubject = result.records;
      }, function(error){$Error.callbackError(error);});*/

      $Exam.getDefault({}, function(result){
        teacher_id = result.teacher_id;
      }, function(error){$Error.callbackError(error);});
    };
    _init();

    $scope.changeClass = function(){
      var existClass = _.find($scope.listClass, function(clas){
        return clas.id === $scope.formData.class_id;
      })
      if(existClass.student_ids.length > 0){
        $Student.getListStudentByIds(existClass, function(result){
          $scope.listStudent =  result;
          listStudentLocal = JSON.parse(JSON.stringify(result));
          _initMark();
        }, function(error){
          $Error.callbackError(error);
        });
      } else{
          $scope.listStudent = [];
          listStudentLocal = [];

      }
    };
    var _initLevel = function(){
      $scope.listLevel = [
        {id:1,name:"level1", display_name:"Yếu"},
        {id:2,name:"level2", display_name:"Kém"},
        {id:3,name:"level3", display_name:"TB"},
        {id:4,name:"level4", display_name:"Khá"},
        {id:5,name:"level5", display_name:"Tốt"}
      ]
    };
    var _getLevelIdByName = function(name){
      switch (name.toLowerCase()) {
        case 'level1':
          return 1;
          break;
        case 'level2':
          return 2;
          break;
        case 'level3':
          return 3;
          break;
        case 'level4':
          return 4;
          break;
        case 'level5':
          return 5;
          break;
        default:
          return null;
          break;
      }
    };
    var _getLevelNameById = function(id){
      switch (id) {
        case 1:
          return'level1';
          break;
        case 2:
          return 'level2';
          break;
        case 3:
          return 'level3';
          break;
        case 4:
          return 'level4';
          break;
        case 5:
          return 'level5';
          break;
        default:
          return null;
          break;
      }
    };

    _initLevel();
    var _initMark = function(){
      $scope.listStudent.forEach(function(student){
        $scope.listMarkOne[student.id] = [
          {mark: null, sequence: 1, id: null, edit: false, delete: false},
          {mark: null, sequence: 2, id: null, edit: false, delete: false},
          {mark: null, sequence: 3, id: null, edit: false, delete: false},
          {mark: null, sequence: 4, id: null, edit: false, delete: false},
          {mark: null, sequence: 5, id: null, edit: false, delete: false}
        ];
        $scope.listMarkTwo[student.id] = [
          {mark: null, sequence: 1, id: null, edit: false, delete: false},
          {mark: null, sequence: 2, id: null, edit: false, delete: false},
          {mark: null, sequence: 3, id: null, edit: false, delete: false},
          {mark: null, sequence: 4, id: null, edit: false, delete: false},
          {mark: null, sequence: 5, id: null, edit: false, delete: false}
        ];
        $scope.listMarkHK[student.id] = [
          {mark: null, sequence: 1, id: null, edit: false, delete: false}
        ];
        $scope.listMarkTB[student.id] = [
          {mark: null, sequence: 1, id: null, edit: false, delete: false}
        ];
        $scope.listMarkHanhKiem[student.id] = [
          {mark: -1, sequence: 1, id: null, edit: false, delete: false, id_level: null}
        ];
        $scope.listMarkHL[student.id] = [
          {mark: -1, sequence: 1, id: null, edit: false, delete: false, id_level: null}
        ];
      });
    }
    $scope.searchExam = function(){
      if($scope.tab === "bd"){
        if($scope.formData.subject_id && $scope.formData.semester_id && $scope.formData.class_id){
          var existSemester = _.find($scope.listSemester, function(sem){
            return sem.id === $scope.formData.semester_id;
          });
           _initMark();
          var info = {
            subject_id: $scope.formData.subject_id,
            class_id: $scope.formData.class_id,
            semester: existSemester.value
          };
          $Exam.getExamBySubjectAndSemester(info, function(result){
            var listExam = result.records;
            listExam = _.groupBy(listExam, function(exam){
              return exam.student_id[0];
            });
            Object.keys(listExam).forEach(function(key){
              listExam[key].forEach(function(exam){
                if(exam.type === "w1"){
                  var existMark = _.find($scope.listMarkOne[key], function(mark){
                    return mark.sequence === exam.sequence;
                  });
                  if(existMark){
                    existMark.mark = exam.mark;
                    existMark.id = exam.id;
                  }
                } else if(exam.type === "w2"){
                  var existMark = _.find($scope.listMarkTwo[key], function(mark){
                    return mark.sequence === exam.sequence;
                  });
                  if(existMark){
                    existMark.mark = exam.mark;
                    existMark.id = exam.id;
                  }
                } else if(exam.type === "final"){
                  $scope.listMarkHK[key][0].mark = exam.mark;
                  $scope.listMarkHK[key][0].id = exam.id;
                } else if(exam.type === "average"){
                  $scope.listMarkTB[key][0].mark = exam.mark;
                  $scope.listMarkTB[key][0].id = exam.id;
                } else if(exam.type === "conduct"){
                  $scope.listMarkHanhKiem[key][0].mark = exam.mark;
                  $scope.listMarkHanhKiem[key][0].name = exam.name;
                  $scope.listMarkHanhKiem[key][0].id_level = _getLevelIdByName(exam.name);
                  $scope.listMarkHanhKiem[key][0].id = exam.id;
                } else if(exam.type === "overall"){
                  $scope.listMarkHL[key][0].mark = exam.mark;
                  $scope.listMarkHL[key][0].name = exam.name;
                  $scope.listMarkHL[key][0].id_level = _getLevelIdByName(exam.name);
                  $scope.listMarkHL[key][0].id = exam.id;
                }
              });
            })
            
          }, function(error){$Error.callbackError(error);})
        }
      } else if($scope.tab==="hk"){
        if($scope.formData.semester_id && $scope.formData.class_id){
          var existSemester = _.find($scope.listSemester, function(sem){
            return sem.id === $scope.formData.semester_id;
          });
           _initMark();
          var info = {
            types:["conduct", "overall"],
            class_id: $scope.formData.class_id,
            semester: existSemester.value
          };
          $Exam.getExamByTypes(info, function(result){
            var listExam = result.records;
            listExam = _.groupBy(listExam, function(exam){
              return exam.student_id[0];
            });
            Object.keys(listExam).forEach(function(key){
              listExam[key].forEach(function(exam){
               if(exam.type === "conduct"){
                  $scope.listMarkHanhKiem[key][0].mark = exam.mark;
                  $scope.listMarkHanhKiem[key][0].name = exam.name;
                  $scope.listMarkHanhKiem[key][0].id_level = _getLevelIdByName(exam.name);
                  $scope.listMarkHanhKiem[key][0].id = exam.id;
                } else if(exam.type === "overall"){
                  $scope.listMarkHL[key][0].mark = exam.mark;
                  $scope.listMarkHL[key][0].name = exam.name;
                  $scope.listMarkHL[key][0].id_level = _getLevelIdByName(exam.name);
                  $scope.listMarkHL[key][0].id = exam.id;
                }
              });
            })
            
          }, function(error){$Error.callbackError(error);})
        }
      }
    };

    $scope.searchSubject = function(){
      if($scope.tab==="bd"){
         $scope.listSubjectIds = [];
        if($scope.formData.semester_id && $scope.formData.class_id){
          var existSemester = _.find($scope.listSemester, function(sem){
            return sem.id === $scope.formData.semester_id;
          });
          _initMark();
          var info = {
            class_id: $scope.formData.class_id,
            semester: existSemester.value
          };
          $resUser.getScheduledSubjects(info, function(result){
            $SchoolSubject.getSubjectByIds({subject_ids: result}, function(listSubject){
              $scope.listSubject = listSubject;
              $scope.searchExam();
            }, function(error){
              $Error.callbackError(error);
            })
          }, function(error){
            $Error.callbackError(error);
          })
        }
      } else{
        $scope.searchExam();
      }
    }

    $scope.chooseTab = function(tab){
      $scope.tab = tab;
      $scope.searchExam();
    }
    var _caculatorMark = function(listMark, type){
      var existSemester = _.find($scope.listSemester, function(sem){
        return sem.id === $scope.formData.semester_id;
      });
      Object.keys(listMark).forEach(function(key){
        listMark[key].forEach(function(mark){
          if(mark.id){
            if(mark.edit){
              if(mark.mark){
                listExamUpdate.push({
                  id: mark.id,
                  mark: mark.mark,
                  name: mark.id_level? _getLevelNameById(mark.id_level) : "/"
                })
              } else{
                listExamDelete.push(mark.id);
              }
            }
          } else{
            if(mark.mark !== null){
              if(type === "conduct" || type==="overall"){
                if(mark.id_level){
                  listExamCreate.push({
                    name: mark.id_level? _getLevelNameById(mark.id_level) : "/",
                    class_id: $scope.formData.class_id,
                    teacher_id: teacher_id,
                    student_id: key,
                    mark: mark.mark,
                    date_exam: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    subject_id: mark.id_level ? null : $scope.formData.subject_id,
                    type: type,
                    semester: existSemester.value,
                    sequence: mark.sequence,
                    company_id: user.company_id
                  });
                }
              } else{
                listExamCreate.push({
                  name: mark.id_level? _getLevelNameById(mark.id_level) : "/",
                  class_id: $scope.formData.class_id,
                  teacher_id: teacher_id,
                  student_id: key,
                  mark: mark.mark,
                  date_exam: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                  subject_id: mark.id_level ? null : $scope.formData.subject_id,
                  type: type,
                  semester: existSemester.value,
                  sequence: mark.sequence,
                  company_id: user.company_id
                });
              }
            }
          }
        });
      });
    }
    $scope.saveExam = function(){
      listExamCreate = [];
      listExamUpdate = [];
      listExamDelete = [];
      _caculatorMark($scope.listMarkOne, "w1");
      _caculatorMark($scope.listMarkTwo, "w2");
      _caculatorMark($scope.listMarkHK, "final");
      _caculatorMark($scope.listMarkTB, "average");
      _caculatorMark($scope.listMarkHanhKiem, "conduct");
      _caculatorMark($scope.listMarkHL, "overall");
      if(listExamCreate.length > 0){
        $Exam.createListExam({listExam: listExamCreate}, function(result){
          toastr.success("Cập nhật thành công", "", {});
          $scope.searchExam();
          $scope.editSave = false;
        }, function(error){$Error.callbackError(error);});
      }
      if(listExamUpdate.length> 0){
        $Exam.updateListExam({listExam: listExamUpdate}, function(result){
          toastr.success("Cập nhật thành công", "", {});
          $scope.searchExam();
          $scope.editSave = false;
        }, function(error){
          $Error.callbackError(error);
        });
      }
      if(listExamDelete.length > 0){
        $Exam.removeExam({listId: listExamDelete}, function(result){
          $scope.searchExam();
          $scope.editSave = false;
        }, function(error){
          $Error.callbackError(error);
        });
      }

    };
    $scope.editForm = function(){
      $scope.editSave = true;
    }
    $scope.cancelEditForm = function(){
      $scope.editSave = false;
    };
    $scope.form ={
      search: ""
    };

    $scope.searchStundent = function(){
      if($scope.form.search.length > 0){
        $scope.listStudent = _.filter(listStudentLocal, function(student) {
          return _bodauTiengViet(student.display_name).toUpperCase().indexOf(_bodauTiengViet($scope.form.search).toUpperCase()) >=0
        });
      } else{
        $scope.listStudent = listStudentLocal;
      }
    };

    var  _bodauTiengViet = function(str) {  
      if(str){
        str= str.toLowerCase();  
        str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");  
        str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");  
        str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");  
        str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");  
        str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");  
        str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");  
        str= str.replace(/đ/g,"d");  
        return str;  
      } else{
        return "";
      }
    };
  }

})();
