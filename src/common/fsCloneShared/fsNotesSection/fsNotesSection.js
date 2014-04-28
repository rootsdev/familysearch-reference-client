(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNotesSection', function (fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsNotesSection/fsNotesSection.tpl.html',
        scope: {
          state: '='
        },
        link: function(scope, elem, attrs) {
          scope.notes = [
            {id: 'foo', title: 'My Title'}
          ];

          _.forEach(scope.notes, function(note) {
            fsItemHelpers.mixinStateFunctions(note);
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();