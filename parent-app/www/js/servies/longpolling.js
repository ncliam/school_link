/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$Longpolling', longpolling);

  /** @ngInject */
  function longpolling($request, $http, localStorageService, toaster, MultipleViewsManager) {
    var _self = this;
    this.last = 0;
     /*if(data[0].message.type === "message"){
      toastr.warning("Có tin nhắn mới từ: " + data[0].message.from_id[1], "", {});
    }*/
    this.poll = function(){
      var user = localStorageService.get("user");
      if(user.login){
        var path ="/api/longpolling";
        var param = {
          last: _self.last,
          sid: user.sid
        };
        localStorageService.set("doPoll", {poll: true});
        $request.pollRequest(path, param, function(data){
          console.log(data);
          if(data.length > 0 && data[0].id){
            _self.last = data[0].id;
            localStorageService.set("new_message", data)
            MultipleViewsManager.updateView("new_message");
          }
          localStorageService.remove("doPoll");
          _self.poll();
        }, function(error){
          localStorageService.remove("doPoll");
          _self.poll();
          console.log(error);
        });
      }
      
    }
  }
})();
