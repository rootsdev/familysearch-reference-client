(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsUtils', function (_, $q, fsApi, fsCurrentUser, fsAgentCache) {

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

          item._open = function() {
            this._state = 'open';
          };

          item._close = function() {
            this._state = 'closed';
          };

          item._edit = function() {
            this._state = 'editing';
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

          function runCallbacks(newValue, callbacks) {
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
              item._state = 'loading';
              $q.all(promises).then(function () {
                // we're finally ready to change the state
                item._state = newValue;
              });
            }
          }

          // run on-open callbacks on item open
          scope.$watch(function () {
            return item._state;
          }, function (newValue) {
            if (newValue === 'open' && !!item._onOpenCallbacks) {
              runCallbacks(newValue, item._onOpenCallbacks);
            }
            else if (newValue === 'editing' && !!item._onEditCallbacks) {
              runCallbacks(newValue, item._onEditCallbacks);
            }
          });
        },

        copyItemState: function(fromItem, toItem) {
          toItem._state = fromItem._state;
          toItem._onOpenCallbacks = fromItem._onOpenCallbacks;
          toItem._onEditCallbacks = fromItem._onEditCallbacks;
        },

        agentSetter: function(scope) {
          return function(item) {
            if (item && item.attribution && item.attribution.$getAgentUrl() && !scope.agent) {
              return fsAgentCache.getAgent(item.attribution.$getAgentUrl()).then(function(agent) {
                scope.agent = agent;
              });
            }
            return null;
          };
        },

        // pass in a name, fact, or gender
        getItemTag: function(item) {
          if (item instanceof fsApi.Name) {
            return 'http://gedcomx.org/Name';
          }
          else if (item instanceof fsApi.Fact) {
            return item.type;
          }
          else { // the only other possibility
            return 'http://gedcomx.org/Gender';
          }
        },

        findById: function(coll, id) {
          return _.find(coll, function (item) {
            return !!id ? item.id === id : !item.id;
          });
        },

        findElement: function(element, className) {
          var spans = element.find('span');
          for (var i = 0, len = spans.length; i < len; i++) {
            if (spans[i].className.indexOf(className) >= 0) {
              return angular.element(spans[i]);
            }
          }
          return null;
        },

        // sometimes we can't refresh something we just saved, so we have to approximate the updated attribution
        approximateAttribution: function(item) {
          fsCurrentUser.get().then(function(currentUser) {
            item.attribution.contributor = { resourceId: currentUser.treeUserId };
            item.attribution.modified = Date.now();
          });
        },

        encodeCustomFactType: function(title) {
          return 'data:,' + encodeURI(title);
        },

        allPromisesSerially: function(arr, promiseGenerator) {
          function await(i) {
            if (i < arr.length) {
              return promiseGenerator(arr[i]).then(function() {
                return await(i+1);
              });
            }
            else {
              return $q.when(null);
            }
          }

          return await(0);
        },

        setConstructor: function(obj, constructorFunction) {
          var result = Object.create(constructorFunction.prototype);
          _.extend(result, obj);
          return result;
        },

        removeEmptyProperties: function(obj) {
          return _.omit(obj, function(value) { return _.isEmpty(value) && value !== 0; });
        }

      };
    });
})();