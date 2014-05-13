(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNotesSection', function (fsItemHelpers, fsApi) {
      return {
        templateUrl: 'fsCloneShared/fsNotesSection/fsNotesSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {
          scope.noteRefs = [];
          fsApi.getPersonNoteRefs(scope.person.id).then(function(response) {
            scope.noteRefs = response.getNoteRefs();
            _.forEach(scope.noteRefs, function(noteRef) {
              fsItemHelpers.mixinStateFunctions(scope, noteRef);
            });
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();