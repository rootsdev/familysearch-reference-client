(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsUtils', function (_, $q, fsApi, fsCurrentUserCache, fsAgentCache) {

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

        copyItemStates: function(fromItems, toItems) {
          _.forEach(toItems, function(item) {
            var fromItem = _.find(fromItems, {id: item.id});
            if (!!fromItem) {
              item._state = fromItem._state;
              item._onOpenCallbacks = fromItem._onOpenCallbacks;
              item._onEditCallbacks = fromItem._onEditCallbacks;
            }
          });
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
          fsCurrentUserCache.getUser().then(function(currentUser) {
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
        },

        getChildrenWithParentsId: function(children, childRelationships) {
          return _.map(children, function(child) {
            return {
              person: child,
              parentsId: _.find(childRelationships, function(rel) { return rel.$getChildId() === child.id; }).id
            };
          });
        },

        makeUrl: function(url) {
          if (url && !url.match(/^https?:\/\//)) {
            return 'http://' + url;
          }
          return url;
        },

        removeQueryFromUrl: function(url) {
          var pos = url.indexOf('?');
          return pos >= 0 ? url.substr(0, pos) : url;
        },

        refresh: function(target, source) {
          for (var propName in target) {
            if (target.hasOwnProperty(propName) && propName.charAt(0) !== '_') {
              delete target[propName];
            }
          }
          _.extend(target, source);
        },

        getSourceRefContexts: function(description, getAgents, max) {
          return description.$getSourceRefsQuery().then(function(response) {
            var promises = [];

            function getAgent(sourceRef) {
              return getAgents ? fsAgentCache.getAgent(sourceRef.attribution.$getAgentUrl()) : $q.when(null);
            }

            response.getPersonSourceRefs().forEach(function(sourceRef) {
              if (max <= 0 || promises.length < max) {
                promises.push($q.all([
                  fsApi.getPerson(sourceRef.$personId),
                  getAgent(sourceRef)
                ]).then(function(responses) {
                  return {
                    sourceRef: sourceRef,
                    person: responses[0].getPerson(),
                    agent: responses[1]
                  };
                }));
              }
            });

            response.getCoupleSourceRefs().forEach(function(sourceRef) {
              if (max <= 0 || promises.length < max) {
                promises.push($q.all([
                  fsApi.getCouple(sourceRef.$coupleId, {persons: true}),
                  getAgent(sourceRef)
                ]).then(function(responses) {
                  var couple = responses[0].getRelationship();
                  return {
                    sourceRef: sourceRef,
                    couple: couple,
                    husband: responses[0].getPerson(couple.$getHusbandId()),
                    wife: responses[0].getPerson(couple.$getWifeId()),
                    agent: responses[1]
                  };
                }));
              }
            });

            response.getChildAndParentsSourceRefs().forEach(function(sourceRef) {
              if (max <= 0 || promises.length < max) {
                promises.push($q.all([
                  fsApi.getChildAndParents(sourceRef.$childAndParentsId, {persons: true}),
                  getAgent(sourceRef)
                ]).then(function(responses) {
                  var parents = responses[0].getRelationship();
                  return {
                    sourceRef: sourceRef,
                    parents: parents,
                    child: responses[0].getPerson(parents.$getChildId()),
                    father: parents.$getFatherId() ? responses[0].getPerson(parents.$getFatherId()) : null,
                    mother: parents.$getMotherId() ? responses[0].getPerson(parents.$getMotherId()) : null,
                    agent: responses[1]
                  };
                }));
              }
            });

            return $q.all(promises);
          });
        }

      };
    });
})();