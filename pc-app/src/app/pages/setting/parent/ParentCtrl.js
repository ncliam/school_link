/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.parent')
    .controller('ParentCtrl', ParentCtrl);

  /** @ngInject */
  function ParentCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $Schoolarity, $uibModal, $Parent, toastr, $Error) {
    $scope.listParent = [];
    var listParent = [];
    $scope.parent = {};
    $scope.form ={search: ""};
    var allHistory;
    $scope.popup1 = {
      opened: false
    };$scope.popup2 = {
      opened: false
    };
    $scope.listCategoryForSearch = [];
    $scope.listCategoryOfParner = [];
    $scope.listCategoryByGroup = {};
    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };
    $scope.open2 = function() {
      $scope.popup2.opened = true;
    };
    $scope.dateOptionsReceipt = {
      dateDisabled: false,
      formatYear: 'yy',
      startingDay: 1,
      dateFormat: 'dd-MM-yyyy'
    };
    var modalParent;

    var _init = function(){
    	$Parent.getAllParent({}, function(result){
        $scope.listParent = result.records;
        listParent = JSON.parse(JSON.stringify($scope.listParent));
      }, function(error){$Error.callbackError(error);});
      if($scope.listCategoryForSearch.length === 0){
        $Parent.getListCategoryForParent({}, function(result){
          $scope.listCategoryForSearch = result.records;
          $scope.listCategoryByGroup = _.groupBy(result.records, function(cate){
            return cate.id;
          })
        }, function(error){
          $Error.callbackError(error);
        })
      }
    };
    _init();

    $scope.openPopupParent = function () {
      $scope.parent = {};
      $scope.listCategoryOfParner = [];
      _openPopupParent();
    };

    var _openPopupParent = function(){
       modalParent = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/setting/parent/widgets/popup.create.update.parent.html",
        scope: $scope
      });
    }

    $scope.editParent = function(parent){
      $scope.listCategoryOfParner = [];
      $scope.parent = JSON.parse(JSON.stringify(parent));
      if($scope.parent.category_id.length > 0){
        $scope.parent.categoryId = $scope.parent.category_id[0];
      }
      _openPopupParent();
    };

    $scope.acceptParent = function(){
      if(!$scope.parent.categoryId){
        $scope.parent.category_id = [[6, false, []]];
      } else{
        $scope.parent.category_id = [[6, false, [$scope.parent.categoryId]]];
      }
      if(_validate()){
        if($scope.parent.id){
          _updateParent();
        }else{
          _createParent();
        }
      }
    };

    var _updateParent = function(){
      $Parent.updateParent($scope.parent, function(result){
        toastr.success("Cập nhật phụ huynh thành công", "", {});
        modalParent.dismiss('cancel');
        _init();
        $scope.parent = {};
      }, function(error){
        $Error.callbackError(error);
      });
    };
    var _createParent = function(){
      $Parent.createParent($scope.parent, function(result){
        toastr.success("Tạo phụ huynh thành công", "", {});
        modalParent.dismiss('cancel');
         _init();
        $scope.parent = {};
      }, function(error){
        $Error.callbackError(error);
      });
    };

    var _validate = function(){
      var flag = true;
      if(!$scope.parent.name || $scope.parent.name.length === 0){
        flag = false;
        toastr.error("Tên không được để trống", "", {});
      }
      if(!$scope.parent.mobile || $scope.parent.mobile.length === 0){
        flag = false;
        toastr.error("Số điện thoại không được để trống", "", {});
      }
      return flag;
    };

    $scope.removeRecords = function(){
      $Parent.removeRecords($scope.parent, function(result){
        _init();
        toastr.success("Xóa thành công", "", {});
        modalParent.dismiss('cancel');
      }, function(error){
        $Error.callbackError(error);
      })
    };

    $scope.searchParent = function(){
      if($scope.form.search.length > 0){
        var search = _bodauTiengViet($scope.form.search);
        $scope.listParent = _.filter(listParent, function(parent) {
          return _bodauTiengViet(parent.name).toUpperCase().indexOf(search.toUpperCase()) >=0 
        });
      } else{
        $scope.listParent = listParent;
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
