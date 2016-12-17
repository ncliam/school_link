/**
 * @author a.demeshko
 * created on 28.12.2015
 */
(function () {
  'use strict';

  angular.module('SchoolLink.pages.notification')
    .controller('NotificationCtrl', NotificationCtrl);

  /** @ngInject */
  function NotificationCtrl($scope, $stateParams, localStorageService, $rootScope, $state, $SchoolClass, $Schedule, MultipleViewsManager, $uibModal, 
    toastr, $Notification, $SchoolClassGroup, $Error, $Parent, $resUser) {
    $scope.listNotification = [];
    var listNotification = [];
    var listGroup = [];
    var listClass = [];
    $scope.dateOptionsReceipt = {
      dateDisabled: false,
      formatYear: 'yy',
      startingDay: 1,
      dateFormat: 'dd-MM-yyyy'
    };
    $scope.show = {list: true};
    var modalConfirmRemove;
    $scope.newNotification = {};

    var _init = function(){
      $Notification.getNotification({}, function(result){
        $scope.listNotification = result;
        $scope.listNotification.forEach(function(noti){
          noti.showDate = moment(noti.date).format("DD/MM/YYYY hh:mm A");
        })
      }, function(error){
        $Error.callbackError(error);
      });
    };
    _init();

     $scope.gotoDetailNotification = function(notification){
      if(notification){
        localStorageService.set("chooseNotification", notification);
      } else{
        $scope.listGroupUserParent = [
          {id: 1, name: "Toàn trường", all: true}
        ];
        $SchoolClassGroup.getAllClassGroup({}, function(result){
          listGroup = result.records;
          result.records.forEach(function(group){
            group.class = false;
          })
          $scope.listGroupUserParent  = $scope.listGroupUserParent.concat(result.records);
        }, function(error){$Error.callbackError(error);});
        $SchoolClass.getAllClass({}, function(result){
          listClass = result.records;
          result.records.forEach(function(group){
            group.class = true;
          })
          $scope.listGroupUserParent  = $scope.listGroupUserParent.concat(result.records);
        }, function(error){$Error.callbackError(error);});
        $Notification.defaultGetNotification({}, function(result){
          $scope.newNotification = result;
          $scope.newNotification.subject = "";
          $scope.newNotification.listToUser = [];
          $scope.newNotification.user_ids = [];

        }, function(error){
          $Error.callbackError(error);
        });
        localStorageService.remove("chooseNotification");
      }
      $scope.show.list = false;
    };
    
    $scope.form = {};
    $scope.searchNotification = function(){
      if($scope.form.search.length > 0){
        var search = _bodauTiengViet($scope.form.search);
        $scope.listNotification = _.filter(listNotification, function(notification) {
          return _bodauTiengViet(notification.class_id[1]).toUpperCase().indexOf(search.toUpperCase()) >=0 
        });
      } else{
        $scope.listNotification = listNotification;
      }
    };
    var _validate = function(){
      var flag = true;
      if(!$scope.newNotification.subject || $scope.newNotification.subject.length === 0){
        toastr.error("Bạn phải nhập tiêu đề", "", {});
        flag = false;
      }
      if(!$scope.newNotification.body || $scope.newNotification.body.length === 0){
        toastr.error("Bạn phải nhập nội dung", "", {});
        flag = false;
      }
      if(!$scope.newNotification.listToUser || $scope.newNotification.listToUser.length === 0){
        toastr.error("Bạn phải chọn đối tượng gửi", "", {});
        flag = false;
      } 
      return flag;
    }
    $scope.createNewNotification = function(){
      if(_validate()){
        var listParentIds = [];
        $scope.newNotification.listToUser.forEach(function(obj){
          if(obj.all){
            listClass.forEach(function(classOb){
              listParentIds = _.union(listParentIds, classOb.parent_ids);
            });
          } else{
            if(!obj.class){
              var listClassChoice = _.filter(listClass, function(classOb){
                return classOb.group_id[0] === obj.id;
              });
              listClassChoice.forEach(function(classOb){
                listParentIds = _.union(listParentIds, classOb.parent_ids);
              });
            } else{
              listParentIds = _.union(listParentIds, obj.parent_ids);
            }
          }
        });
        $Parent.getListParentByIds({parent_ids: listParentIds}, function(listParent){
          var user_ids = [];
          listParent.forEach(function(parent){
            if(parent.parent_user_id){
              user_ids.push({id:parent.parent_user_id[0]});
            }
            if(parent.parent_partner_id){
              $scope.newNotification.user_ids .push(parent.parent_partner_id[0]);
            }
          });
          $Notification.createNotification($scope.newNotification, function(result){
            $Notification.sentNotifition({id: result}, function(success){
              $Notification.pushNotificationToOneSignal({notification: $scope.newNotification.subject, to_users: user_ids}, function(pushNotification){

              }, function(error){});
              $scope.backList();
            }, function(error){
              $Error.callbackError(error);
            })
          }, function(error){$Error.callbackError(error);});
        }, function(error){
          $Error.callbackError(error);
        });
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
     $scope.backList = function(){
      $scope.show.list = true;
      _init();
    }
  }

})();
