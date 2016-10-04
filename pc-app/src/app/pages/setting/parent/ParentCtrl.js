/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.parent')
    .controller('ParentCtrl', ParentCtrl);

  /** @ngInject */
  function ParentCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $Schoolarity, $uibModal, $Parent, toastr) {
    $scope.listParent = [];
    $scope.parent = {};
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
      }, function(error){});
      if($scope.listCategoryForSearch.length === 0){
        $Parent.getListCategoryForParent({}, function(result){
          $scope.listCategoryForSearch = result.records;
          $scope.listCategoryByGroup = _.groupBy(result.records, function(cate){
            return cate.id;
          })
        }, function(error){

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
        $scope.parent.category_id.forEach(function(cateId){
          var existCate = _.find($scope.listCategoryForSearch, function(cate){
            return cate.id === cateId;
          });
          $scope.listCategoryOfParner.push(existCate);
        })
      }
      _openPopupParent();
    };

    $scope.acceptParent = function(){
      if($scope.listCategoryOfParner.length === 0){
        $scope.parent.category_id = [[6, false, []]];
      } else{
        var category_id = [];
        $scope.listCategoryOfParner.forEach(function(cate){
          category_id.push(cate.id);
        });
        $scope.parent.category_id = [[6, false, category_id]];
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

      });
    };
    var _createParent = function(){
      $Parent.createParent($scope.parent, function(result){
        toastr.success("Tạo phụ huynh thành công", "", {});
        modalParent.dismiss('cancel');
         _init();
        $scope.parent = {};
      }, function(error){

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
    }
  }

})();
