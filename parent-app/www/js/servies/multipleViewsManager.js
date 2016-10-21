/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
  angular.module('SchoolLink.service')
  .factory('MultipleViewsManager', function ($rootScope, $state) {
    var viewCallbacks = {};
    var pendingCalls = [];
    return {
      updateView: function (viewName) {
        var callback = viewCallbacks[viewName];
        if (callback) {
            callback();
        } else {
            pendingCalls.push({
                viewName: viewName
            });
        }
      },
      isActive: function () {
        return $state.current.views;
      },
      updated: function (name, callback) {
        viewCallbacks[name] = callback;
        
        for (var i = 0; i < pendingCalls.length; i++) {
            var call = pendingCalls[i];
            if (call.viewName === name) {
                callback(call.params);
                pendingCalls.splice(i, 1);
                return;
            }
        }
      }
    };
  });
