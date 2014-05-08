(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNoteEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsNote/fsNoteEdit/fsNoteEdit.tpl.html',
        scope: {
          item: '=',
          save: '&'
        },
        link: function(scope) {
          scope.form = {
            subject: scope.item ? scope.item.subject : '',
            text: scope.item ? scope.item.text : ''
          };

          scope.submit = function () {
            // TBD
          };
        }
      };
    });
})();
