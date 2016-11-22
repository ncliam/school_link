/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.student')
    .controller('StudentListCtrl', StudentListCtrl);

  /** @ngInject */
  function StudentListCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $SchoolClass, $Student, $School, $Error, $uibModal, toastr) {
    $scope.listStudent = [];
    var allHistory;
    $scope.form ={search: ""};
    var listStudent;
    var _init = function(){
      $Student.getAllStudent({}, function(result){
        $scope.listStudent  = result.records;
        $scope.listStudent.forEach(function(stu){
          stu.birthday ? stu.birthdayFormat = moment(stu.birthday).format("DD-MM-YYYY") : stu.birthdayFormat = false;
        });
        listStudent = JSON.parse(JSON.stringify($scope.listStudent));
      }, function(error){$Error.callbackError(error);});

    };
    _init();

     $scope.gotoDetailStudent = function(student){
      if(student){
        localStorageService.set("chooseStudent", student);
      } else{
        localStorageService.remove("chooseStudent");
      }
      $state.go("setting.student.detail");
    };

    var tmpRecords;
    var modalConfirmRemove;
    $scope.confirmRemove = function(student){
      tmpRecords = student;
      modalConfirmRemove = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/setting/class/widgets/popup.confrim.remove.html",
        scope: $scope
      });
    };

    $scope.removeRecords = function(){
      $Student.removeRecords(tmpRecords, function(result){
        modalConfirmRemove.dismiss('cancel');
        toastr.success("Xóa thành công", "", {});
        _init();
      }, function(error){$Error.callbackError(error);})
    };
    $scope.searchStundent = function(){
      if($scope.form.search.length > 0){
        var search = _bodauTiengViet($scope.form.search);
        $scope.listStudent = _.filter(listStudent, function(student) {
          return _bodauTiengViet(student.display_name).toUpperCase().indexOf(search.toUpperCase()) >=0 
        });
      } else{
        $scope.listStudent = listStudent;
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
