(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNotesSection', function (_, fsItemHelpers, fsApi, $rootScope) {
      return {
        templateUrl: 'fsCloneShared/fsNotesSection/fsNotesSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {
          function init() {
            scope.noteRefs = [];
            fsApi.getPersonNoteRefs(scope.person.id).then(function(response) {
              scope.noteRefs = response.getNoteRefs();
              _.forEach(scope.noteRefs, function(noteRef) {
                console.log('noteRef', noteRef);
                fsItemHelpers.mixinStateFunctions(scope, noteRef);
              });
            });
          }

          scope.$on('delete', function(event, item) {
            console.log('fsNotesSection delete', item);
            //noinspection JSUnresolvedFunction
            event.stopPropagation();
          });

          scope.$on('save', function(event, note, changeMessage) {
            //noinspection JSUnresolvedFunction
            event.stopPropagation();
            console.log('fsNotesSection save', note, changeMessage);
            //noinspection JSUnresolvedFunction
            note.$save(changeMessage).then(function() {
              console.log('fsNotesSection saved');
              _.find(scope.noteRefs, {id: note.id})._open();
              $rootScope.$emit('saved', note);
            });
          });

          scope.$on('add', function(event) {
            console.log('fsNotesSection add');
            //noinspection JSUnresolvedFunction
            event.stopPropagation();
          });

          init();
        }
      };
    });
})();