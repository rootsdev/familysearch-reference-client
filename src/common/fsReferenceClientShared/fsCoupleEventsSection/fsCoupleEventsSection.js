(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsCoupleEventsSection', function (_, $rootScope, $filter, fsUtils, fsApi, fsConfirmationModal,
                                                  fsCoupleFactTypes) {
      return {
        templateUrl: 'fsReferenceClientShared/fsCoupleEventsSection/fsCoupleEventsSection.tpl.html',
        scope: {
          state: '=',
          couple: '='
        },
        link: function(scope) {
          function sort(facts) {
            return _.sortBy(facts, function(fact) { return fact.$getFormalDate(); });
          }

          // read
          function init() {
            var oldItems = scope.items;

            scope.items = sort(scope.couple.$getFacts());

            _.forEach(scope.items, function(item) {
              fsUtils.mixinStateFunctions(scope, item);
            });

            if (!!oldItems) { // copy old item state
              fsUtils.copyItemStates(oldItems, scope.items);
            }
          }

          init();

          scope.$watch(function () {
            return scope.couple;
          }, function () {
            init();
          }, true);

          // add menu is couple fact types
          scope.addMenu = _.map(fsCoupleFactTypes, function(fact) {
            return {
              label: $filter('fsGedcomxLabel')(fact.type),
              value: fact.type
            };
          });

          // add
          scope.$on('add', function(event, type) {
            event.stopPropagation();
            // if not already adding
            if (!fsUtils.findById(scope.items, null)) {
              var item = new fsApi.Fact({type: type});
              fsUtils.mixinStateFunctions(scope, item);
              item._edit();
              scope.items.push(item);
              scope.items = sort(scope.items);
            }
          });

          // delete
          scope.$on('delete', function(event, item) {
            event.stopPropagation();
            fsConfirmationModal.open({
              title: 'Delete '+ $filter('fsGedcomxLabel')(item.type),
              subTitle: 'Reason for Deleting This Information',
              showChangeMessage: true,
              okLabel: 'Delete'
            }).then(function(changeMessage) {
              item._busy = true;
              scope.couple.$deleteFact(item, changeMessage);
              scope.couple.$save(null, true).then(function() {
                _.remove(scope.items, {id: item.id});
                $rootScope.$emit('deleted', item);
              });
            });
          });

          // save
          scope.$on('save', function(event, item, changeMessage) {
            event.stopPropagation();
            item._busy = true;
            if (!item.id) {
              scope.couple.$addFact(item);
            }
            item.$setChangeMessage(changeMessage);
            scope.couple.$save(null, true).then(function() {
              item._open();
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