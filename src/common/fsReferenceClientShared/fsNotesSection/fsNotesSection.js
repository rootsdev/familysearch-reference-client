(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsNotesSection', function ($rootScope, _, fsApi, fsConfirmationModal, fsUtils) {
      return {
        templateUrl: 'fsReferenceClientShared/fsNotesSection/fsNotesSection.tpl.html',
        scope: {
          state: '=',
          person: '=', // pass in person or couple or parents
          couple: '=',
          parents: '='
        },
        link: function(scope) {
          // read
          function init() {
            var oldNotes = scope.notes;

            scope.notes = [];
            var promise;
            if (!!scope.person) {
              promise = fsApi.getPersonNotes(scope.person.id);
            }
            else if (!!scope.couple) {
              promise = fsApi.getCoupleNotes(scope.couple.id);
            }
            else if (!!scope.parents) {
              promise = fsApi.getChildAndParentsNotes(scope.parents.id);
            }
            promise.then(function(response) {
              scope.notes = response.getNotes();
              _.forEach(scope.notes, function(note) {
                fsUtils.mixinStateFunctions(scope, note);
              });

              if (!!oldNotes) { // copy old item state
                fsUtils.copyItemStates(oldNotes, scope.notes);
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
            if (!fsUtils.findById(scope.notes, null)) {
              var note = new fsApi.Note();
              if (!!scope.person) {
                note.$personId = scope.person.id;
              }
              else if (!!scope.couple) {
                note.$coupleId = scope.couple.id;
              }
              else if (!!scope.parents) {
                note.$childAndParentsId = scope.parents.id;
              }
              fsUtils.mixinStateFunctions(scope, note);
              note._edit();
              scope.notes.unshift(note);
            }
          });

          // delete
          scope.$on('delete', function(event, note) {
            event.stopPropagation();
            fsConfirmationModal.open({
              title: 'Delete Note',
              subTitle: 'Reason to Delete This Note',
              showChangeMessage: true,
              okLabel: 'Delete'
            }).then(function(changeMessage) {
              note._busy = true;
              note.$delete(changeMessage).then(function() {
                _.remove(scope.notes, {id: note.id});
                $rootScope.$emit('deleted', note);
              });
            });
          });

          // save
          scope.$on('save', function(event, note, changeMessage) {
            event.stopPropagation();
            note._busy = true;
            note.$save(changeMessage, true).then(function() {
              note._busy = false;
              note._open();
              $rootScope.$emit('saved', note);
            });
          });

          // cancel save
          scope.$on('cancel', function(event, note) {
            event.stopPropagation();
            if (!!note.id) {
              note._open();
            }
            else {
              _.remove(scope.notes, function(note) { return !note.id; });
            }
          });

        }
      };
    });
})();