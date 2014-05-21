(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsOtherInfoSection', function (_, $rootScope, $filter, fsUtils, fsApi,
                                               fsVitalFactTypes, fsOtherFactTypes, fsNameTypes, fsAlsoKnownAsNameType) {
      return {
        templateUrl: 'fsCloneShared/fsOtherInfoSection/fsOtherInfoSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {
          function getNameIndex(name) {
            var index = fsNameTypes.indexOf(name.type);
            if (index >= 0) {
              return index;
            }
            return fsNameTypes.length;
          }

          function factTypeComparer(a, b) {
            // sort names above facts by type, then last-mod date
            var indexA, indexB;
            if (a instanceof fsApi.Name && b instanceof fsApi.Name) {
              indexA = getNameIndex(a);
              indexB = getNameIndex(b);
              if (indexA === indexB) {
                if (a.attribution && b.attribution) {
                  return a.attribution.modified - b.attribution.modified;
                }
                else if (a.attribution) {
                  return -1;
                }
                else if (b.attribution) {
                  return 1;
                }
                return 0;
              }
              else {
                return indexA - indexB;
              }
            }
            else if (a instanceof fsApi.Name) {
              return -1;
            }
            else if (b instanceof fsApi.Name) {
              return 1;
            }
            // sort facts by fact type, then date
            indexA = _.findIndex(fsOtherFactTypes, {type: a.type});
            indexB = _.findIndex(fsOtherFactTypes, {type: b.type});
            if (indexA === indexB && a.$getFormalDate && a.$getFormalDate() && b.$getFormalDate && b.$getFormalDate()) {
              return a.$getFormalDate() < b.$getFormalDate() ? -1 : 1;
            }
            else if (indexA >= 0 && indexB >= 0) {
              return indexA - indexB;
            }
            else if (indexA >= 0) {
              return -1;
            }
            else if (indexB >= 0) {
              return 1;
            }
            return 0;
          }

          // read
          function init() {
            scope.items = _.reject(scope.person.$getNames(), function(name) {
              return name.id === (scope.person.$getPreferredName() ? scope.person.$getPreferredName().id : '');
            }).concat(_.reject(scope.person.$getFacts(), function(fact) {
              return _.contains(fsVitalFactTypes, fact.type) || fact.type === 'http://familysearch.org/v1/LifeSketch';
            })).sort(factTypeComparer);

            _.forEach(scope.items, function(item) {
              fsUtils.mixinStateFunctions(scope, item);
            });
          }

          init();

          // add menu is Alternate Name + other fact types + custom
          scope.addMenu = _.map([{type: fsAlsoKnownAsNameType}].concat(fsOtherFactTypes).concat([{type: ''}]), function(other) {
            return {
              label: other.type === fsAlsoKnownAsNameType ? 'Alternate Name' : $filter('fsGedcomxLabel')(other.type),
              value: other.type
            };
          });

          scope.isName = function(item) {
            return (item instanceof fsApi.Name);
          };

          // add
          scope.$on('add', function(event, type) {
            event.stopPropagation();
            // if not already adding
            if (!fsUtils.findById(scope.items, null)) {
              var item = type === fsAlsoKnownAsNameType ? new fsApi.Name({type: type}) : new fsApi.Fact({type: type});
              fsUtils.mixinStateFunctions(scope, item);
              item._edit();
              scope.items.push(item);
              scope.items.sort(factTypeComparer);
            }
          });

          // delete
          scope.$on('delete', function(event, item, changeMessage) {
            event.stopPropagation();
            item._busy = true;
            if (item instanceof fsApi.Name) {
              scope.person.$deleteName(item, changeMessage);
            }
            else {
              scope.person.$deleteFact(item, changeMessage);
            }
            scope.person.$save(null, true).then(function() {
              _.remove(scope.items, {id: item.id});
              $rootScope.$emit('deleted', item);
            });
          });

          // save
          scope.$on('save', function(event, item, changeMessage) {
            event.stopPropagation();
            item._busy = true;
            if (!item.id) {
              if (item instanceof fsApi.Name) {
                scope.person.$addName(item);
              }
              else { // Fact
                scope.person.$addFact(item);
              }
            }
            item.$setChangeMessage(changeMessage);
            scope.person.$save(null, true).then(function() {
              item._open();
              init(); // re-init items so we get the new item.id
              $rootScope.$emit('saved', item);
            });
          });

          // cancel save
          scope.$on('cancel', function(event, item) {
            event.stopPropagation();
            if (!!item.id) {
              item._open();
            }
            else {
              _.remove(scope.items, function(item) { return !item.id; });
            }
          });

        }
      };
    });
})();