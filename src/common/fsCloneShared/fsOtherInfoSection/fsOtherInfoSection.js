(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsOtherInfoSection', function (_, $rootScope, $filter, fsUtils, fsApi, fsVitalFactTypes, fsOtherFactTypes) {
      return {
        templateUrl: 'fsCloneShared/fsOtherInfoSection/fsOtherInfoSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {
          function factTypeComparer(a, b) {
            var indexA = _.findIndex(fsOtherFactTypes, {type: a.type});
            var indexB = _.findIndex(fsOtherFactTypes, {type: b.type});
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

          scope.addMenu = _.map(fsOtherFactTypes, function(otherFactType) {
            return {
              label: $filter('fsGedcomxLabel')(otherFactType.type),
              value: otherFactType.type
            };
          });
          scope.addMenu.push({label:'Custom Event', value: ''});

          scope.isName = function(item) {
            return (item instanceof fsApi.Name);
          };

          // add
          scope.$on('add', function(event, type) {
            event.stopPropagation();
            // if not already adding
            if (!fsUtils.findById(scope.items, null)) {
              var otherFactType = _.find(fsOtherFactTypes, {type: type});
              var item = otherFactType && otherFactType.isName ? new fsApi.Name({type: type}) : new fsApi.Fact({type: type});
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
            console.log('save', item, scope.person);
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