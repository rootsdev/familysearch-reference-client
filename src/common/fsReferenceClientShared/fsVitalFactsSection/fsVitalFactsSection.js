(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsVitalFactsSection', function (_, $rootScope, $filter, $q, fsUtils, fsApi, fsVitalFactTypes, fsDeathFactType,
                                                fsConfirmationModal) {
      return {
        templateUrl: 'fsReferenceClientShared/fsVitalFactsSection/fsVitalFactsSection.tpl.html',
        scope: {
          state: '=',
          person: '=',
          sources: '='
        },
        link: function(scope) {
          // read
          function init() {
            var oldVitals = scope.vitals;

            scope.vitals = [
              scope.person.$getPreferredName() || new fsApi.Name({type: 'http://gedcomx.org/BirthName', preferred: true}),
              scope.person.gender || {}
            ];
            fsVitalFactTypes.forEach(function(factType) {
              scope.vitals.push(scope.person.$getFact(factType.type) || new fsApi.Fact({type: factType.type}));
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

            if (!!oldVitals) { // copy old item state
              fsUtils.copyItemStates(oldVitals, scope.vitals);
            }
          }

          init();

          scope.$watch(function () {
            return scope.person;
          }, function () {
            init();
          }, true);

          // delete
          scope.$on('delete', function(event, fact) {
            event.stopPropagation();
            if (fact.type === fsDeathFactType) {
              fsConfirmationModal.open({
                title: 'Unable to bring someone back from the dead',
                subTitle: 'You cannot change a person\'s status from deceased to living here. ' +
                  'Instead, please contact FamilySearch support at https://familysearch.org/ask/help'
              });
            }
            else {
              fsConfirmationModal.open({
                title: 'Delete '+ $filter('fsGedcomxLabel')(fact.type),
                subTitle: 'Reason for Deleting This Information',
                showChangeMessage: true,
                okLabel: 'Delete'
              }).then(function(changeMessage) {
                fact._busy = true;
                scope.person.$deleteFact(fact, changeMessage);
                scope.person.$save(null, true).then(function() {
                  $rootScope.$emit('deleted', fact);
                });
              });
            }
          });

          // save
          scope.$on('save', function(event, item, changeMessage) {
            event.stopPropagation();
            item._busy = true;
            if (item instanceof fsApi.Name) {
              item.$setChangeMessage(changeMessage);
              if (!item.id) {
                scope.person.$addName(item);
              }
            }
            else if (item instanceof fsApi.Fact) {
              item.$setChangeMessage(changeMessage);
              if (!item.id) {
                scope.person.$addFact(item);
              }
            }
            else if (item.type) { // gender
              scope.person.$setGender(item.type, changeMessage);
            }
            scope.person.$save(null, true).then(function() {
              item._open();
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
