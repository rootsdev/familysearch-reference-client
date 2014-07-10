(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsDiscussionDetails', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsDiscussion/fsDiscussionDetails/fsDiscussionDetails.tpl.html',
        scope: {
          disc: '=',
          agent: '=',
          commentsState: '='
        },
        link: function(scope) {
          scope.addComment = function() {
            scope.commentsState.value = 'adding';
          };
        }
      };
    });
})();