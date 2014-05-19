(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsVitalFactsSection', function (_, $rootScope, $filter, $q, fsUtils, fsApi, fsVitalFactTypes, fsDeathFactType,
                                                fsConfirmationModal) {
      return {
        templateUrl: 'fsCloneShared/fsVitalFactsSection/fsVitalFactsSection.tpl.html',
        scope: {
          state: '=',
          person: '=',
          sources: '='
        },
        link: function(scope) {
          scope.vitalFactTypes = fsVitalFactTypes;

          // read
          function init() {
            var oldVitals = scope.vitals;
            scope.vitals = [
              scope.person.$getPreferredName() || new fsApi.Name({}),
              scope.person.gender || {}
            ];
            fsVitalFactTypes.forEach(function(type) {
              scope.vitals.push(scope.person.$getFact(type) || new fsApi.Fact({type: type}));
            });
            _.forEach(scope.vitals, function(vital) {
              fsUtils.mixinStateFunctions(scope, vital);
            });
            // death is special
            var death = _.find(scope.vitals, {type: fsDeathFactType});
            death._living = scope.person.living;
            death._exists = (function() {
              var oldExists = death._exists;
              return function() {
                return oldExists.call(this) || this._living;
              };
            })();
            // copy existing states
            if (!!oldVitals) {
              for (var i = 0; i < oldVitals.length; i++) {
                scope.vitals[i]._state = oldVitals[i]._state;
              }
            }
          }

          init();

          // delete
          scope.$on('delete', function(event, fact, changeMessage) {
            event.stopPropagation();
            (fact.type === fsDeathFactType ? $q.when(changeMessage) : fsConfirmationModal.open({
              title: 'Delete '+ $filter('fsGedcomxLabel')(fact.type),
              subTitle: 'Reason for Deleting This Information',
              showChangeMessage: true,
              okLabel: 'Delete'
            })).then(function(changeMessage) {
              fact._busy = true;
              scope.person.$deleteFact(fact, changeMessage);
              scope.person.$save(null, true).then(function() {
                init(); // re-init to correctly handle things like living
                $rootScope.$emit('deleted', fact);
              });
            });
          });

          // save
          scope.$on('save', function(event, item, changeMessage) {
            event.stopPropagation();
            item._busy = true;
            if (item instanceof fsApi.Name) {
              console.log('save name', item);
            }
            else if (item instanceof fsApi.Fact) {
              console.log('fact saving', item);
              item.$setChangeMessage(changeMessage);
              if (!item.id) {
                scope.person.$addFact(item);
              }
            }
            else if (item.type) { // gender
              scope.person.$setGender(item.type, changeMessage);
            }
            console.log('person saving', scope.person);
            scope.person.$save(null, true).then(function() {
              console.log('person saved', scope.person);
              item._open();
              init(); // re-init to correctly handle things like living
              $rootScope.$emit('saved', item);
            });
          });

          // cancel save
          scope.$on('cancel', function(event, item) {
            event.stopPropagation();
            item._open();
          });

        }
      };
    });
})();
