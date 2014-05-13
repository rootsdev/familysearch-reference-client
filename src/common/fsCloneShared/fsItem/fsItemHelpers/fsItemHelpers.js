(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsItemHelpers', function ($q) {

      return {
        mixinStateFunctions: function(scope, item) {
          item._state = item._state || 'closed';

          item._isOpen = function() {
            return this._state === 'open';
          };

          item._isEditing = function() {
            return this._state === 'editing';
          };

          item._exists = function() {
            return !!this.id;
          };

          item._toggleOpen = function() {
            this._state = this._state === 'open' ? 'closed' : 'open';
          };

          item._close = function() {
            this._state = 'closed';
          };

          item._edit = function() {
            this._state = 'editing';
          };

          item._cancelEdit = function() {
            this._state = this._exists() ? 'open' : 'closed';
          };

          item._onOpen = function (callback) {
            if (!item._onOpenCallbacks) {
              item._onOpenCallbacks = [];
            }
            item._onOpenCallbacks.push(callback);
            if (item._state === 'open') {
              callback(item);
            }
          };

          // run on-open callbacks on item open
          scope.$watch(function () {
            return item._state;
          }, function (newValue) {
            if (newValue === 'open' && !!item._onOpenCallbacks) {
              var promises = [];
              item._onOpenCallbacks.forEach(function (callback) {
                // if the callback returns a promise, don't open the item until the promise is fulfilled
                var promise = callback(item);
                if (promise && promise.then) {
                  promises.push(promise);
                }
              });
              if (promises.length) {
                // close the item until all handlers have completed
                item._state = 'closed';
                $q.all(promises).then(function () {
                  // we're finally ready to open the item
                  item._state = 'open';
                });
              }
            }
          });
        },

        agentSetter: function(scope) {
          return function(item) {
            if (item && item.attribution && !scope.agent) {
              return item.attribution.$getAgent().then(function (response) {
                scope.agent = response.getAgent();
              });
            }
            return null;
          };
        }

      };
    });
})();