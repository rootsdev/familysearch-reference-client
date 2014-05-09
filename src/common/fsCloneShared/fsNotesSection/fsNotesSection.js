(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNotesSection', function (fsItemHelpers, fsApi, $q) {
      return {
        templateUrl: 'fsCloneShared/fsNotesSection/fsNotesSection.tpl.html',
        scope: {
          state: '=',
          pid: '='
        },
        link: function(scope, elem, attrs) {
          scope.notes = [];
          fsApi.getPersonNoteRefs(scope.pid).then(function(response) {
            var promises = _.map(response.getNoteRefs(), function(ref) {
              return fsApi.getPersonNote(ref);
            });
            $q.all(promises).then(function(responses) {
              scope.notes = _.map(responses, function(response) {
                return response.getNote();
              });
              _.forEach(scope.notes, function(note) {
                fsItemHelpers.mixinStateFunctions(note);
              });
            });
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();