(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNote', function(_) {
      return {
        templateUrl: 'fsCloneShared/fsNote/fsNote.tpl.html',
        scope: {
          noteRef: '='
        },
        link: function(scope) {
          scope.noteRef._onOpen(function(noteRef) {
            if (!!scope.noteRef && !scope.note) {
              return noteRef.$getNote().then(function(response) {
                scope.note = response.getNote();
                // noteRef maintains the state; bind note._cancelEdit to noteRef
                scope.note._cancelEdit = _.bind(noteRef._cancelEdit, noteRef);
                // set the agent
                // the agent must also be set for edit, but the note must be open before it can be edited so it will be set
                return scope.note.attribution.$getAgent().then(function(response) {
                  scope.agent = response.getAgent();
                });
              });
            }
            return null;
          });

          scope.save = function () {
            // TBD
          };

          scope.remove = function () {
            // TBD
          };

        }
      };
    });
})();