(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNoteEdit', function() {

      // emit: save(note, reason)

      return {
        templateUrl: 'fsCloneShared/fsNote/fsNoteEdit/fsNoteEdit.tpl.html',
        scope: {
          note: '=',
          agent: '='
        },
        link: function(scope) {
          scope.$watch(function() {
            return scope.note;
          }, function() {
            console.log('fsNoteEdit', scope.note);
            scope.form = {
              subject: scope.note ? scope.note.subject : '',
              text: scope.note ? scope.note.text : ''
            };
          });

          scope.$on('save', function(event, note) {
            //noinspection JSUnresolvedFunction
            event.stopPropagation();

            console.log('fsNoteEdit save', note);
            scope.note.subject = scope.form.subject;
            scope.note.text = scope.form.text;

            scope.$parent.$emit('save', scope.note, scope.form.reason);
          });
        }
      };
    });
})();
