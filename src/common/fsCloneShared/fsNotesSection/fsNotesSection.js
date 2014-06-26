(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNotesSection', function ($rootScope, _, fsApi, fsConfirmationModal, fsUtils) {
      return {
        templateUrl: 'fsCloneShared/fsNotesSection/fsNotesSection.tpl.html',
        scope: {
          state: '=',
          person: '=', // pass in person or couple or parents
          couple: '=',
          parents: '='
        },
        link: function(scope) {
          // read
          function init() {
            var oldNoteRefs = scope.noteRefs;

            scope.noteRefs = [];
            var promise;
            if (!!scope.person) {
              promise = fsApi.getPersonNoteRefs(scope.person.id);
            }
            else if (!!scope.couple) {
              promise = fsApi.getCoupleNoteRefs(scope.couple.id);
            }
            else if (!!scope.parents) {
              promise = fsApi.getChildAndParentsNoteRefs(scope.parents.id);
            }
            promise.then(function(response) {
              scope.noteRefs = response.getNoteRefs();
              _.forEach(scope.noteRefs, function(noteRef) {
                fsUtils.mixinStateFunctions(scope, noteRef);
              });

              if (!!oldNoteRefs) { // copy old item state
                fsUtils.copyItemStates(oldNoteRefs, scope.noteRefs);
              }
            });
          }

          init();

          var unbindRestored = $rootScope.$on('restored', function() {
            init(); // in case a note was restored (I could check the type of object restored, but I'm being lazy)
          });
          scope.$on('$destroy', unbindRestored);

          // add
          scope.$on('add', function(event) {
            event.stopPropagation();
            // if not already adding
            if (!fsUtils.findById(scope.noteRefs, null)) {
              var noteRef = new fsApi.NoteRef();
              if (!!scope.person) {
                noteRef.$personId = scope.person.id;
              }
              else if (!!scope.couple) {
                noteRef.$coupleId = scope.couple.id;
              }
              else if (!!scope.parents) {
                noteRef.$childAndParentsId = scope.parents.id;
              }
              fsUtils.mixinStateFunctions(scope, noteRef);
              noteRef._edit();
              scope.noteRefs.unshift(noteRef);
            }
          });

          // delete
          scope.$on('delete', function(event, noteRef) {
            event.stopPropagation();
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
            event.stopPropagation();
            note._busy = true;
            var noteRef = fsUtils.findById(scope.noteRefs, note.id);
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
            event.stopPropagation();
            var noteRef = fsUtils.findById(scope.noteRefs, note.id);
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