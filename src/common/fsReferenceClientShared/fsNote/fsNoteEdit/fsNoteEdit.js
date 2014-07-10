(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsNoteEdit', function() {

      // emit: save(note, reason)

      return {
        templateUrl: 'fsReferenceClientShared/fsNote/fsNoteEdit/fsNoteEdit.tpl.html',
        scope: {
          note: '=',
          agent: '='
        },
        link: function(scope) {
          // populate the form from the note
          scope.$watch(function() {
            return scope.note;
          }, function() {
            scope.form = {
              subject: scope.note ? scope.note.subject : '',
              text: scope.note ? scope.note.text : '',
              reason: scope.form ? scope.form.reason : ''
            };
          }, true);

          // save the form to the note
          scope.$on('save', function(event, note) {
            event.stopPropagation();
            note.subject = scope.form.subject;
            note.text = scope.form.text;
            scope.$parent.$emit('save', note, scope.form.reason);
          });

        }
      };
    });
})();
