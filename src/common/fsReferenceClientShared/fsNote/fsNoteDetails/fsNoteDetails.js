(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsNoteDetails', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsNote/fsNoteDetails/fsNoteDetails.tpl.html',
        scope: {
          note: '=',
          agent: '='
        }
      };
    });
})();