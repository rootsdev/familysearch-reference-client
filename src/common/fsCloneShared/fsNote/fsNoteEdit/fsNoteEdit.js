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
          scope.submit = function () {
            // TBD
          };
        }
      };
    });
})();