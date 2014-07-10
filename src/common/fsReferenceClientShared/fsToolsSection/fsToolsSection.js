(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsToolsSection', function (fsApi, fsDeleteConfirmationModal) {
      return {
        templateUrl: 'fsReferenceClientShared/fsToolsSection/fsToolsSection.tpl.html',
        scope: {
          person: '=', // pass in person or couple+husband+wife or parents+child+father+mother
          couple: '=',
          husband: '=',
          wife: '=',
          parents: '=',
          child: '=',
          father: '=',
          mother: '='
        },
        link: function(scope) {
          scope.remove = function() {
            fsDeleteConfirmationModal.open({
              person: scope.person,
              couple: scope.couple,
              husband: scope.husband,
              wife: scope.wife,
              parents: scope.parents,
              child: scope.child,
              father: scope.father,
              mother: scope.mother
            }).then(function(changeMessage) {
              if (!!scope.person) {
                scope.$emit('delete', scope.person, changeMessage);
              }
              else if (!!scope.couple) {
                scope.$emit('delete', scope.couple, changeMessage);
              }
              else if (!!scope.parents) {
                scope.$emit('delete', scope.parents, changeMessage);
              }
            });
          };

        }
      };
    });
})();