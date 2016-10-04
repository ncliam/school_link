/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.setting.group')
    .controller('GroupCtrl', GroupCtrl);

  /** @ngInject */
  function GroupCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $SchoolClassGroup, $uibModal, toastr, $translate) {
    $scope.listGroup = [];
    var allHistory;
    $scope.group = {};
    var modalShoolGroup;

    var _init = function(){
    	$SchoolClassGroup.getAllClassGroup({}, function(result){
        $scope.listGroup  = result.records;
      }, function(error){})
    };
    _init();

    $scope.openPopupGroup = function () {
      modalShoolGroup = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/setting/groups/widgets/popup.create.update.group.html",
        scope: $scope
      });
    };

    $scope.editGroup = function(group){
      $scope.group = JSON.parse(JSON.stringify(group));
      $scope.openPopupGroup();
    };
    $scope.acceptGroup = function(){
      if(_validate()){
        if($scope.group.id){
          _updateGroup();
        }else{
          _createGroup();
        }
      }
    };

    var _updateGroup = function(){
      $SchoolClassGroup.updateClassGroup($scope.group, function(result){
        toastr.success($translate.instant('classGroup.update.success'), "", {});
        modalShoolGroup.dismiss('cancel');
        var existGroup = _.find($scope.listGroup, function(sub){
          return sub.id === $scope.group.id;
        });
        existGroup.name = $scope.group.name;
        $scope.group = {};
      }, function(error){
      });
    };
    var _createGroup = function(){
      $SchoolClassGroup.createClassGroup($scope.group, function(result){
        toastr.success($translate.instant('classGroup.create.success'), "", {});
        modalShoolGroup.dismiss('cancel');
        $scope.group.id = result;
        var newGroup = JSON.parse(JSON.stringify($scope.group));
        $scope.listGroup.unshift(newGroup);
        $scope.group = {};
      }, function(error){

      });
    };

    var _validate = function(){
      var flag = true;
      if(!$scope.group.name || $scope.group.name.length === 0){
        flag = false;
        toastr.error($translate.instant('classGroup.name.require'), "", {});
      }
      return flag;
    }
  }

})();
