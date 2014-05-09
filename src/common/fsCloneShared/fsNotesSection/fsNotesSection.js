(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNotesSection', function (fsItemHelpers, fsApi) {
      return {
        templateUrl: 'fsCloneShared/fsNotesSection/fsNotesSection.tpl.html',
        scope: {
          state: '=',
          pid: '='
        },
        link: function(scope) {
          scope.noteRefs = [];
          fsApi.getPersonNoteRefs(scope.pid).then(function(response) {
            scope.noteRefs = response.getNoteRefs();
            _.forEach(scope.noteRefs, function(noteRef) {
              fsItemHelpers.mixinStateFunctions(noteRef);
            });
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();