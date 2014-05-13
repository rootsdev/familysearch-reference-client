(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsDiscussionDetails', function() {
      return {
        templateUrl: 'fsCloneShared/fsDiscussion/fsDiscussionDetails/fsDiscussionDetails.tpl.html',
        scope: {
          disc: '=',
          agent: '=',
          commentsState: '='
        },
        link: function(scope) {
          scope.addComment = function() {
            scope.commentsState.value = 'open';
          };
        }
      };
    });
})();