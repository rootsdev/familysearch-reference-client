(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsCommentDetails', function() {
      return {
        templateUrl: 'fsCloneShared/fsComment/fsCommentDetails/fsCommentDetails.tpl.html',
        scope: {
          item: '='
        }
      };
    });
})();