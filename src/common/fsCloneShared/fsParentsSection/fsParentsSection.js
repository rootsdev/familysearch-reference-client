(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsParentsSection', function (_, $rootScope, $state, fsApi, fsUtils, fsConfirmationModal) {
      return {
        templateUrl: 'fsCloneShared/fsParentsSection/fsParentsSection.tpl.html',
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
            scope.members = [
              scope.father || new fsApi.Person(),
              scope.mother || new fsApi.Person(),
              scope.child
            ];
            _.forEach(scope.members, function(member) {
              fsUtils.mixinStateFunctions(scope, member);
            });
          }

          init();

          scope.getRole = function(index) {
            return index === 0 ? 'Father' :
                   index === 1 ? 'Mother' : 'Child';
          };

          // save
          scope.$on('save', function(event, item) {
            console.log('save', item);
            event.stopPropagation();
            item._busy = true;
//            scope.couple.$save(null, true).then(function() {
            item._open();
            item._busy = false;
            $rootScope.$emit('saved', item);
//            });
          });

          // cancel save
          scope.$on('cancel', function(event, item) {
            event.stopPropagation();
            item._open();
          });

          // change
          scope.$on('change', function(event, member) {
            event.stopPropagation();
            $state.go('find-add', {
              husbandId: member === scope.members[0] || !scope.father ? null : scope.father.id,
              wifeId:    member === scope.members[1] || !scope.mother ? null : scope.mother.id,
              parentsId: scope.parents.id,
              returnToParentsId: scope.parents.id
            });
          });

          // delete
          scope.$on('delete', function(event, member) {
            event.stopPropagation();
            return fsConfirmationModal.open({
              title: 'Remove Relationship',
              subTitle: 'Reason for Removing This Person From This Relationship',
              showChangeMessage: true,
              okLabel: 'Remove'
            }).then(function(changeMessage) {
              member._busy = true;
              if (member === scope.members[0]) {
                scope.parents.$deleteFather(changeMessage);
              }
              else {
                scope.parents.$deleteMother(changeMessage);
              }
              scope.parents.$save(null, true).then(function() {
                member._busy = false;
                if (member === scope.members[0]) {
                  scope.father = null;
                }
                else {
                  scope.mother = null;
                }
                init();
              });
            });
          });

        }
      };
    });
})();