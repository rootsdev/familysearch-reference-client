(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNote', function(fsApi, fsAgentCache) {
      return {
        templateUrl: 'fsCloneShared/fsNote/fsNote.tpl.html',
        scope: {
          noteRef: '='
        },
        link: function(scope) {
          function populateNote(noteRef) {
            if (!scope.note) {
              if (!noteRef.id) {
                scope.note = new fsApi.Note({
                  $personId: noteRef.$personId,
                  $childAndParentsId: noteRef.$childAndParentsId,
                  $coupleId: noteRef.$coupleId,
                  subject: '',
                  text: ''
                });
                scope.agent = null;
              }
              else {
                noteRef._busy = true;
                return noteRef.$getNote().then(function(response) {
                  scope.note = response.getNote();
                  // set the agent
                  return fsAgentCache.getAgent(scope.note.attribution.$getAgentUrl()).then(function(agent) {
                    scope.agent = agent;
                    noteRef._busy = false;
                  });
                });
              }
            }
            return null;
          }

          scope.noteRef._onOpen(populateNote);
          scope.noteRef._onEdit(populateNote);

        }
      };
    });
})();