/**
 * User service.
 *
 * @author    Martin Micunda {@link http://martinmicunda.com}
 * @copyright Copyright (c) 2015, Martin Micunda
 * @license   The MIT License {@link http://opensource.org/licenses/MIT}
 */
(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name TopicService
     * @module app.core
     * @requires Restangular
     * @description
     * Service to get the user data.
     *
     * @ngInject
     */
    function SchoolService($http, $q, SERVICE_API_URL, SERVICE_API_URL_SEARCH, UtilService, localStorageService) {
        return {
          selectSchool: function(params){
            console.log('selectSchool.params ', params);
            var paramSelectSchool = {
              model: "res.users",
              session_id: params.userInfo.session_id ,
              context: params.userInfo.context,
              sid: params.userInfo.sid,
              method:"select_school",
              args: [params.schoolId]
            };
            var deferred = $q.defer();
            $http.post(SERVICE_API_URL, paramSelectSchool).then(function(responseS){
              console.log('res.selectSchool', responseS);
              deferred.resolve({status:true});
            }, function(error){
              console.log('signin error ', error);
              deferred.reject({status:false});
            });

            return deferred.promise;
          },
          getSchoolAndChild: function(params) {
            var schoolList = [];
            var fieldsSchool = ["id","name","school_ids", "children"];
            var paramsSchool = {
              model: "res.users", //"res.company"
              args: [params.userInfo.uid, fieldsSchool],
              method: "read",
              session_id: params.userInfo.session_id ,
              context: params.userInfo.context,
              sid: params.userInfo.sid
            }
            var deferred = $q.defer();
            $http.post(SERVICE_API_URL, paramsSchool).then(function(searchResponse){
              console.log('res.schools', searchResponse.data.result);

              if(searchResponse.data.result.school_ids){
                var school_ids = [];
                for(var i = 0; i < searchResponse.data.result.school_ids.length; i++){
                  school_ids.push(parseInt(searchResponse.data.result.school_ids[i]));
                }

                console.log('school_ids ', school_ids);
                var childrenfields = ["id","name","children"];
                var childrenparams = {
                  model: "res.company", //"res.company"
                  args: [school_ids, childrenfields],
                  method: "read",
                  session_id: params.userInfo.session_id ,
                  context: params.userInfo.context,
                  sid: params.userInfo.sid
                }

                $http.post(SERVICE_API_URL, childrenparams).then(function(searchResponseC){
                  console.log('res.children', searchResponseC.data.result);
                  if(searchResponseC.data.result){
                    var student_ids = [];
                    for(var x = 0; x < searchResponseC.data.result.length; x++){
                      var childrentList = [];
                      for(var i = 0; i < searchResponseC.data.result[x].children.length; i++){
                        student_ids.push(parseInt(searchResponseC.data.result[x].children[i]));
                        var childrentItem = {
                          id:searchResponseC.data.result[x].children[i],
                          name:""
                        }
                        childrentList.push(childrentItem);
                      }
                      var schoolListItem = {
                        id:searchResponseC.data.result[x].id,
                        name:searchResponseC.data.result[x].name,
                        childrents:childrentList
                      }
                      schoolList.push(schoolListItem);
                    }

                    var fieldsStudent = ["id","name","class_ids"];
                    var paramsStudent = {
                      model: "hr.employee", //"res.company"
                      args: [student_ids],
                      method: "name_get",
                      session_id: params.userInfo.session_id ,
                      context: params.userInfo.context,
                      sid: params.userInfo.sid
                    }

                    $http.post(SERVICE_API_URL, paramsStudent).then(function(resultStudent){
                      console.log('resultStudent', resultStudent.data.result);
                      for(var i = 0; i < resultStudent.data.result.length; i++){
                        for(var x = 0; x < schoolList.length; x++){
                          for(var y = 0; y < schoolList[x].childrents.length; y++){
                            if(schoolList[x].childrents[y].id == resultStudent.data.result[i][0]){
                              schoolList[x].childrents[y].name = resultStudent.data.result[i][1];
                            }
                          }
                        }
                      }

                      deferred.resolve({status:true,data:schoolList});
                    }, function(error){
                      console.log('signin error ', error);

                      deferred.reject({status:true,data:schoolList});
                    });
                  }
                  else {
                    deferred.reject({status:true,data:schoolList});
                  }
                }, function(error){
                  console.log('signin error ', error);
                  deferred.reject({status:true,data:schoolList});
                });
              }
              else {
                deferred.reject({status:true,data:schoolList});
              }

            }, function(error){
              console.log('signin error ', error);
              deferred.reject({status:true,data:schoolList});
            });

            return deferred.promise;
          },

          getTKB: function(params){
            var deferred = $q.defer();
            var classId = localStorageService.get("class")[0];
            var fieldsSchedule = ["name","class_id","lines","semester","display_name"];
            var domain;
            if(params.semester){
              domain = [["class_id", "=", classId], ["semester", "=", params.semester]];
            } else{
              domain = [["class_id", "=", classId]];
            }
            var paramsSchedule = {
              model: "school.schedule", //"res.company"
              domain: domain,
              fields: fieldsSchedule,//info.fields || _self.fields,
              offset: 0,// offset: info.offset || _self.offset,
              limit: 2000,// limit: info.limit || _self.limit,
              session_id: params.userInfo.session_id ,
              context: params.userInfo.context,
              sid: params.userInfo.sid
            }

            $http.post(SERVICE_API_URL_SEARCH, paramsSchedule).then(function(resSchedule){
              
              var ids = [];
              if(resSchedule.data.result){
                if(resSchedule.data.result.records.length > 0){
                  localStorageService.set('school.schedule', resSchedule.data.result.records);
                } else{
                  localStorageService.set('school.schedule',[]);
                }
                for(var i = 0; i < resSchedule.data.result.records.length; i++){
                  if(resSchedule.data.result.records[i].lines){
                    for(var x = 0; x < resSchedule.data.result.records[i].lines.length; x++){
                      ids.push(resSchedule.data.result.records[i].lines[x]);
                    }
                  }
                }
              }
              if(ids.length > 0){
                /** Lấy ra các row trong thời khóa biểu ****/
                /** Truyền lên class_id ****/
                console.log('ids ', ids);
                var fieldsRow = ["name","week_day","user_id","subject_id","begin","end", "teacher_id"];
                var dataTietSang =["tiet1", "tiet2", "tiet3", "tiet4", "tiet5", "tiet6"];
                var dataTietChieu =["tiet7", "tiet8", "tiet9", "tiet10", "tiet11", "tiet12"]
                var paramsRow = {
                  model: "school.schedule.line", //"res.company"
                  args: [ids, fieldsRow],
                  method: "read",
                  // domain: [["class_id", "=", 1]],
                  // fields: fields,//info.fields || _self.fields,
                  // offset: 0,// offset: info.offset || _self.offset,
                  // limit: 2000,// limit: info.limit || _self.limit,
                  session_id: params.userInfo.session_id ,
                  context: params.userInfo.context,
                  sid: params.userInfo.sid
                }

                $http.post(SERVICE_API_URL, paramsRow).then(function(resRow){
                  console.log('school.schedule.line', resRow.data);
                  var tkbWeek = [];
                  if(resRow.data.result){
                    var tkbbd = JSON.parse(JSON.stringify(resRow.data.result));
                    for(var i =0; i < resRow.data.result.length; i++){
                      var monhoc = "";
                      if(resRow.data.result[i].subject_id.length > 1){
                        monhoc = resRow.data.result[i].subject_id[1];
                      }
                      var tkbTiet = {
                        tenTiet:resRow.data.result[i].name,
                        tenMonHoc:monhoc
                      }
                      var isExitDay = false;
                      for(var x = 0; x < tkbWeek.length; x++){
                        if(tkbWeek[x].name == resRow.data.result[i].week_day){
                          var isExistTiet = _.find(dataTietSang, function(tiet){
                            return tiet === tkbTiet.tenTiet;
                          })
                          if(isExistTiet){
                            tkbWeek[x].tietHocSang.push(tkbTiet);
                          } else{
                            tkbWeek[x].tietHocChieu.push(tkbTiet);
                          }
                          isExitDay = true;
                        }
                      }
                      if(!isExitDay){
                        var isExistTiet = _.find(dataTietSang, function(tiet){
                          return tiet === tkbTiet.tenTiet;
                        })
                        var tkbDay = {
                          name:resRow.data.result[i].week_day,
                          index:UtilService.convertDayToThu(resRow.data.result[i].week_day),
                          tietHocSang:isExistTiet? [tkbTiet]: [],
                          tietHocChieu: !isExistTiet? [tkbTiet]: []
                        }
                        tkbWeek.push(tkbDay);
                      }
                    }

                    deferred.resolve({status:true,data:tkbWeek, tkbbd: tkbbd});
                  }
                  else {
                    deferred.resolve({status:false});
                  }
                });
              }
              else {
                deferred.resolve({status:true, data: []});
              }
            });

            return deferred.promise;
          },

          getKetQuaHoc : function(params){
            var deferred = $q.defer();
            var markList = [];
            var fields = ["name", "mark", "date_exam", "teacher_id", "subject_id", "weight", "type", "semester"];
            var paramKetqua = {
              model: "school.exam.move", //"res.company"
              domain: [["student_id", "=", params.student_id]],
              fields: fields,//info.fields || _self.fields,
              offset: 0,// offset: info.offset || _self.offset,
              limit: 2000,// limit: info.limit || _self.limit,
              session_id: params.userInfo.session_id ,
              context: params.userInfo.context,
              sid: params.userInfo.sid
            }

            $http.post(SERVICE_API_URL_SEARCH, paramKetqua).then(function(resultMark){
              console.log('school.schedule ', resultMark);
              if(resultMark.data.result.records){
                for(var i = 0; i < resultMark.data.result.records.length; i++){
                  var subjectId = "";
                  var subjectName = "";
                  var teacherId = "";
                  var teacherName = "";

                  if(resultMark.data.result.records[i].subject_id && resultMark.data.result.records[i].subject_id.length >= 2){
                    subjectId = resultMark.data.result.records[i].subject_id[0];
                    subjectName = resultMark.data.result.records[i].subject_id[1];
                  }

                  if(resultMark.data.result.records[i].teacher_id && resultMark.data.result.records[i].teacher_id.length >= 2){
                    teacherId = resultMark.data.result.records[i].teacher_id[0];
                    teacherName = resultMark.data.result.records[i].teacher_id[1];
                  }

                  markList.push({
                    id:resultMark.data.result.records[i].id,
                    mark:resultMark.data.result.records[i].mark,
                    name:resultMark.data.result.records[i].name,
                    date_exam:resultMark.data.result.records[i].date_exam,
                    date_exam_week:UtilService.getDayWeekTitle(resultMark.data.result.records[i].date_exam),
                    type:resultMark.data.result.records[i].type,
                    subjectId:subjectId,
                    subjectName:subjectName,
                    teacherId:teacherId,
                    teacherName:teacherName,
                    semester: resultMark.data.result.records[i].semester
                  });

                  // markList.push({
                  //   id:resultMark.data.result.records[i].id,
                  //   mark:10,
                  //   name:resultMark.data.result.records[i].name,
                  //   date_exam:"2016-07-21 17:38:22",
                  //   date_exam_week:UtilService.getDayWeekTitle(new Date("2016-07-21 17:38:22")),
                  //   type:"w"+(i+1),
                  //   subjectId:subjectId,
                  //   subjectName:subjectName,
                  //   teacherId:teacherId,
                  //   teacherName:teacherName
                  // })
                  //
                  // markList.push({
                  //   id:resultMark.data.result.records[i].id,
                  //   mark:9,
                  //   name:resultMark.data.result.records[i].name,
                  //   date_exam:"2016-07-29 17:38:22",
                  //   date_exam_week:UtilService.getDayWeekTitle(new Date("2016-07-29 17:38:22")),
                  //   type:"w"+(i+1),
                  //   subjectId:subjectId,
                  //   subjectName:subjectName,
                  //   teacherId:teacherId,
                  //   teacherName:teacherName
                  // })
                }

                deferred.resolve({status:true,data:markList});
              }
              else {
                deferred.resolve({status:false});
              }
            });

            return deferred.promise;
          },

          getContacts:function(params){
            console.log('selectSchool.params ', params);
            var teacherResults = [];
            var parentResults = [];

            var fields = ["teacher_id", "teacher_ids", "teacher_name", "parent_ids", "name"];
            var paramsContacts = {
              model: "school.class", //"res.company"
              domain: [["student_ids", "=", params.student_id]],
              fields: fields,//info.fields || _self.fields,
              offset: 0,// offset: info.offset || _self.offset,
              limit: 2000,// limit: info.limit || _self.limit,
              session_id: params.userInfo.session_id ,
              context: params.userInfo.context,
              sid: params.userInfo.sid
            }

            var deferred = $q.defer();
            $http.post(SERVICE_API_URL_SEARCH, paramsContacts).then(function(resContact){
              console.log('res.getContacts', resContact);
              var parentIds = [];
              var teacherIds = [];
              var childrenIds = [];
              var teacherId = 0;
              if(resContact.data.result && resContact.data.result.records){
                for(var i = 0; i < resContact.data.result.records.length; i++){
                  if(resContact.data.result.records[i].parent_ids){
                    for(var x = 0; x < resContact.data.result.records[i].parent_ids.length; x++){
                      parentIds.push(resContact.data.result.records[i].parent_ids[x]);
                    }
                  }
                  if(resContact.data.result.records[i].teacher_id){
                    teacherIds.push(resContact.data.result.records[i].teacher_id);
                    teacherId = resContact.data.result.records[i].teacher_id;
                  }
                  if(resContact.data.result.records[i].teacher_ids){
                    for(var x = 0; x < resContact.data.result.records[i].teacher_ids.length; x++){
                      teacherIds.push(resContact.data.result.records[i].teacher_ids[x]);
                    }
                  }
                }

                var isReturnTeacher = false;
                var isReturnParent = false;
                if(teacherIds.length > 0){
                  var fields = ["id","name", "work_email", "work_phone", "user_id"];
                  var paramsTeacher = {
                    model: "hr.employee", //"res.company"
                    args: [teacherIds, fields],
                    method: "read",
                    session_id: params.userInfo.session_id ,
                    context: params.userInfo.context,
                    sid: params.userInfo.sid
                  }

                  $http.post(SERVICE_API_URL, paramsTeacher).then(function(resTeachers){
                    console.log('hr.employee', resTeachers.data.result);

                    if(resTeachers.data.result){
                      for(var i = 0; i < resTeachers.data.result.length; i++){
                        teacherResults.push({
                          id:resTeachers.data.result[i].id,
                          name:resTeachers.data.result[i].name,
                          mobile:resTeachers.data.result[i].work_phone,
                          email:resTeachers.data.result[i].work_email,
                          show:false,
                          user_id: resTeachers.data.result[i].user_id,
                        })
                      }
                    }

                    isReturnTeacher = true;

                    if(isReturnParent && isReturnTeacher){
                      deferred.resolve({status:true, teacherResults:teacherResults, parentResults:parentResults});
                    }
                  });
                }

                if(parentIds.length > 0){
                  var fields = ["id","name","children", "mobile", "parent_user_id", "email", "category_id"];
                  var paramsParent = {
                    model: "res.partner", //"res.company"
                    args: [parentIds, fields],
                    method: "read",
                    session_id: params.userInfo.session_id ,
                    context: params.userInfo.context,
                    sid: params.userInfo.sid
                  }

                  $http.post(SERVICE_API_URL, paramsParent).then(function(resParents){
                    console.log('res.partner', resParents.data.result);
                    if(resParents.data.result){
                      for(var i = 0; i < resParents.data.result.length; i++){
                        var childrens = [];
                        if(resParents.data.result[i].children){
                          for(var x = 0; x < resParents.data.result[i].children.length; x++){
                            childrenIds.push(resParents.data.result[i].children[x]);
                            childrens.push({id:resParents.data.result[i].children[x], name:""});
                          }
                        }
                        parentResults.push({
                          id:resParents.data.result[i].id,
                          name:resParents.data.result[i].name,
                          show:false,
                          children:childrens,
                          parent_user_id: resParents.data.result[i].parent_user_id,
                          mobile: resParents.data.result[i].mobile,
                          email: resParents.data.result[i].email,
                          category_id: resParents.data.result[i].category_id
                        });
                      }

                      if(childrenIds.length > 0){
                        var fields = ["id","name"];
                        var paramsChild = {
                          model: "hr.employee", //"res.company"
                          args: [childrenIds, fields],
                          method: "read",
                          session_id: params.userInfo.session_id ,
                          context: params.userInfo.context,
                          sid: params.userInfo.sid
                        }

                        $http.post(SERVICE_API_URL, paramsChild).then(function(resChild){
                          console.log('res.child', resChild.data.result);
                          if(resChild.data.result){
                            for(var i = 0; i < resChild.data.result.length;i++){
                              for(var x = 0; x < parentResults.length;x++){
                                for(var k = 0; k < parentResults[x].children.length;k++){
                                  if(parentResults[x].children[k].id == resChild.data.result[i].id){
                                    parentResults[x].children[k].name = resChild.data.result[i].name;
                                  }
                                }
                              }
                            }
                          }
                          isReturnParent = true;
                          if(isReturnParent && isReturnTeacher){
                            deferred.resolve({status:true, teacherResults:teacherResults, parentResults:parentResults});
                          }
                        });
                      }
                      else {
                        isReturnParent = true;
                        if(isReturnParent && isReturnTeacher){
                          deferred.resolve({status:true, data:resContact});
                        }
                      }
                    }
                  });
                }
                // deferred.resolve({status:true, data:responseS});
              }
              else {
                deferred.reject({status:false});
              }



            }, function(error){
              console.log('get contact error ', error);
              deferred.reject({status:false});
            });

            return deferred.promise;
          }
        };

    }

    angular
        .module('SchoolLink.service')
        .factory('SchoolService', SchoolService);
})();
