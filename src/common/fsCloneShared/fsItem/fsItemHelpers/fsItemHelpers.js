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

          item._onEdit = function (callback) {
            if (!item._onEditCallbacks) {
              item._onEditCallbacks = [];
            }
            item._onEditCallbacks.push(callback);
            if (item._state === 'editing') {
              callback(item);
            }
          };

          function runCallbacks(newValue, oldValue, callbacks) {
            var promises = [];
            callbacks.forEach(function (callback) {
              // if the callback returns a promise, don't change the item state until the promise is fulfilled
              var promise = callback(item);
              if (promise && promise.then) {
                promises.push(promise);
              }
            });
            if (promises.length) {
              // wait until all handlers have completed before changing the state
              item._state = oldValue;
              $q.all(promises).then(function () {
                // we're finally ready to change the state
                item._state = newValue;
              });
            }
          }

          // run on-open callbacks on item open
          scope.$watch(function () {
            return item._state;
          }, function (newValue, oldValue) {
            if (newValue === 'open' && !!item._onOpenCallbacks) {
              runCallbacks(newValue, oldValue, item._onOpenCallbacks);
            }
            else if (newValue === 'editing' && !!item._onEditCallbacks) {
              runCallbacks(newValue, oldValue, item._onEditCallbacks);
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