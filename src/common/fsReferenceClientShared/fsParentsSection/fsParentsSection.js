(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsParentsSection', function (_, $rootScope, fsApi, fsLocation, fsUtils, fsConfirmationModal) {
      return {
        templateUrl: 'fsReferenceClientShared/fsParentsSection/fsParentsSection.tpl.html',
        scope: {
          state: '=',
          parents: '=',
          child: '=',
          father: '=',
          mother: '='
        },
        link: function(scope) {
          // init
          function init() {
            var oldItems = scope.items;

            scope.members = [
              scope.father || new fsApi.Person(),
              scope.mother || new fsApi.Person(),
              scope.child
            ];

            scope.items = scope.members.concat(scope.parents.$getFatherFacts()).concat(scope.parents.$getMotherFacts());

            _.forEach(scope.items, function(item) {
              fsUtils.mixinStateFunctions(scope, item);
            });

            if (!!oldItems) { // copy old item state
              fsUtils.copyItemStates(oldItems, scope.items);
            }
          }

          init();

          scope.$watch(function () {
            return {
              parents: scope.parents,
              child: scope.child,
              father: scope.father,
              mother: scope.mother
            };
          }, function () {
            init();
          }, true);

          scope.getRole = function(index) {
            return index === 0 ? 'Father' :
                   index === 1 ? 'Mother' : 'Child';
          };

          scope.getFacts = function(index) {
            return index === 0 ? scope.parents.$getFatherFacts() : scope.parents.$getMotherFacts();
          };

          scope.getFormalDate = function(fact) {
            return fact.$getFormalDate() || '';
          };

          scope.addFact = function(index) {
            var facts = scope.getFacts(index);
            // if not already adding
            if (!fsUtils.findById(facts, null)) {
              var fact = new fsApi.Fact({type: 'http://gedcomx.org/BiologicalParent'});
              fsUtils.mixinStateFunctions(scope, fact);
              fact._edit();
              if (index === 0) {
                scope.parents.$addFatherFact(fact);
              }
              else {
                scope.parents.$addMotherFact(fact);
              }
            }
          };

          function isFatherFact(fact) {
            return _.contains(scope.parents.$getFatherFacts(), fact);
          }

          // save
          scope.$on('save', function(event, item, changeMessage) {
            event.stopPropagation();
            item._busy = true;
            if (item instanceof fsApi.Fact) {
              item.$setChangeMessage(changeMessage);
              scope.parents.$save(null, true).then(function() {
                item._open();
                init(); // re-init items so we get the new item.id
                $rootScope.$emit('saved', item);
              });
            }
            else {
//            scope.couple.$save(null, true).then(function() {
              item._open();
              item._busy = false;
              $rootScope.$emit('saved', item);
//            });
            }
          });

          // cancel save
          scope.$on('cancel', function(event, item) {
            event.stopPropagation();
            if (!!item.id) {
              item._open();
            }
            else if (isFatherFact(item)) {
              _.remove(scope.parents.$getFatherFacts(), function(item) { return !item.id; });
            }
            else {
              _.remove(scope.parents.$getMotherFacts(), function(item) { return !item.id; });
            }
          });

          // change
          scope.$on('change', function(event, member) {
            event.stopPropagation();
            fsLocation.setFindAddLocation(fsUtils.removeEmptyProperties({
              husbandId: member === scope.members[0] || !scope.father ? null : scope.father.id,
              wifeId:    member === scope.members[1] || !scope.mother ? null : scope.mother.id,
              parentsId: scope.parents.id,
              returnToParentsId: scope.parents.id
            }));
          });

          // delete
          scope.$on('delete', function(event, item) {
            event.stopPropagation();
            if (item instanceof fsApi.Fact) {
              fsConfirmationModal.open({
                title: 'Delete Relationship Type',
                subTitle: 'Reason for Deleting This Information',
                showChangeMessage: true,
                okLabel: 'Delete'
              }).then(function(changeMessage) {
                item._busy = true;
                if (isFatherFact(item)) {
                  scope.parents.$deleteFatherFact(item, changeMessage);
                }
                else {
                  scope.parents.$deleteMotherFact(item, changeMessage);
                }
                scope.parents.$save(null, true).then(function() {
                  init();
                  $rootScope.$emit('deleted', item);
                });
              });
            }
            else {
              fsConfirmationModal.open({
                title: 'Remove Relationship',
                subTitle: 'Reason for Removing This Person From This Relationship',
                showChangeMessage: true,
                okLabel: 'Remove'
              }).then(function(changeMessage) {
                item._busy = true;
                if (item === scope.members[0]) {
                  scope.parents.$deleteFather(changeMessage);
                }
                else {
                  scope.parents.$deleteMother(changeMessage);
                }
                scope.parents.$save(null, true).then(function() {
                  item._busy = false;
                  if (item === scope.members[0]) {
                    scope.father = null;
                  }
                  else {
                    scope.mother = null;
                  }
                  init();
                  $rootScope.$emit('deleted', item);
                });
              });
            }
          });

        }
      };
    });
})();