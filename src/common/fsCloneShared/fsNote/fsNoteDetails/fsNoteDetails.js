(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNoteDetails', function() {
      return {
        templateUrl: 'fsCloneShared/fsNote/fsNoteDetails/fsNoteDetails.tpl.html',
        scope: {
          note: '='
        }
      };
    });
})();