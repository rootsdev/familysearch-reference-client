(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsVitalFactsSection', function ($rootScope, fsUtils, fsApi, fsVitalFactTypes, fsDeathFactType) {
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
          function read() {
            var oldVitals = scope.vitals;
            scope.vitals = {
              name: scope.person.$getPreferredName() || new fsApi.Name({}),
              gender: scope.person.gender || {}
            };
            fsVitalFactTypes.forEach(function(type) {
              scope.vitals[type] = scope.person.$getFact(type) || new fsApi.Fact({type: type});
            });
            scope.vitals[fsDeathFactType]._living = scope.person.living;
            _.forEach(scope.vitals, function(vital) {
              fsUtils.mixinStateFunctions(scope, vital);
            });
            // override exists function for death to count living as exists
            scope.vitals[fsDeathFactType]._exists = (function() {
              var oldExists = scope.vitals[fsDeathFactType]._exists;
              return function() {
                return oldExists.call(this) || this._living;
              };
            })();
            // copy existing states
            if (oldVitals) {
              ['name', 'gender'].concat(fsVitalFactTypes).forEach(function(type) {
                scope.vitals[type]._state = oldVitals[type]._state;
              });
            }
          }
          read();

          // add
//          scope.$on('add', function(event) {
//            event.stopPropagation();
//            // if not already adding
//            if (!fsUtils.findById(scope.discs, null)) {
//              var disc = {
//                ref: new fsApi.DiscussionRef({ $personId: scope.person.id }),
//                discussion: new fsApi.Discussion(),
//                id: null
//              };
//              fsUtils.mixinStateFunctions(scope, disc);
//              disc._edit();
//              scope.discs.unshift(disc);
//            }
//          });

          // delete
//          scope.$on('delete', function(event) { //, disc) {
//            event.stopPropagation();
//            fsConfirmationModal.open({
//              title: 'Delete Discussion',
//              subTitle: 'Are you sure that you want to delete this discussion and all of its comments?',
//              okLabel: 'Yes'
//            }).then(function() {
//              // delete discussion ref and discussion
//              disc._busy = true;
//              $q.all([disc.ref.$delete(), disc.discussion.$delete()]).then(function() {
//                _.remove(scope.discs, {id: disc.id});
//                $rootScope.$emit('deleted', disc);
//              });
//            });
//          });

          // save
          scope.$on('save', function(event, item, changeMessage) {
            event.stopPropagation();
            item._busy = true;
            if (item instanceof fsApi.Name) {
              console.log('save name');
            }
            else if (item instanceof fsApi.Fact) {
              console.log('save fact');
            }
            else if (item.type) { // gender
              scope.person.$setGender(item.type, changeMessage);
            }
            scope.person.$save(null, true).then(function() {
              item._open();
              read(); // re-read to correctly handle things like living
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
