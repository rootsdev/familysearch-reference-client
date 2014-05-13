(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNoteEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsNote/fsNoteEdit/fsNoteEdit.tpl.html',
        scope: {
          note: '=',
          agent: '=',
          save: '&'
        },
        link: function(scope) {
          scope.form = {
            subject: scope.note ? scope.note.subject : '',
            text: scope.note ? scope.note.text : ''
          };

          scope.submit = function () {
            // TBD
          };
        }
      };
    });
})();
