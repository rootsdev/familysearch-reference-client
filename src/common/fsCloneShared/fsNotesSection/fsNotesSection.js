(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNotesSection', function ($rootScope, _, fsItemHelpers, fsApi, fsConfirmationModal) {
      return {
        templateUrl: 'fsCloneShared/fsNotesSection/fsNotesSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {
          // read
          scope.noteRefs = [];
          fsApi.getPersonNoteRefs(scope.person.id).then(function(response) {
            scope.noteRefs = response.getNoteRefs();
            _.forEach(scope.noteRefs, function(noteRef) {
              fsItemHelpers.mixinStateFunctions(scope, noteRef);
            });
          });

          // add
          scope.$on('add', function() {
            // if not already adding
            if (!fsItemHelpers.findById(scope.noteRefs, null)) {
              var noteRef = new fsApi.NoteRef();
              noteRef.$personId = scope.person.id;
              fsItemHelpers.mixinStateFunctions(scope, noteRef);
              noteRef._edit();
              scope.noteRefs.unshift(noteRef);
            }
          });

          // delete
          scope.$on('delete', function(event, noteRef) {
            fsConfirmationModal.open({
              title: 'Delete Note',
              subTitle: 'Reason to Delete This Note',
              showChangeMessage: true,
              okLabel: 'Delete'
            }).then(function(changeMessage) {
              noteRef._busy = true;
              noteRef.$delete(changeMessage).then(function() {
                _.remove(scope.noteRefs, {id: noteRef.id});
                $rootScope.$emit('deleted', noteRef);
              });
            });
          });

          // save
          scope.$on('save', function(event, note, changeMessage) {
            note._busy = true;
            var noteRef = fsItemHelpers.findById(scope.noteRefs, note.id);
            note.$save(changeMessage, true).then(function() {
              note._busy = false;
              // update noteRef from note and mark it open
              noteRef.subject = note.subject;
              noteRef.id = note.id;
              noteRef._open();
              $rootScope.$emit('saved', note);
            });
          });

          // cancel save
          scope.$on('cancel', function(event, note) {
            var noteRef = fsItemHelpers.findById(scope.noteRefs, note.id);
            if (!!noteRef.id) {
              noteRef._open();
            }
            else {
              _.remove(scope.noteRefs, function(noteRef) { return !noteRef.id; });
            }
          });

        }
      };
    });
})();