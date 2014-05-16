(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsCommentDetails', function(fsCurrentUser) {
      return {
        templateUrl: 'fsCloneShared/fsComment/fsCommentDetails/fsCommentDetails.tpl.html',
        scope: {
          comment: '='
        },
        link: function(scope) {
          // set agent
          if (scope.comment.$getAgentId()) {
            scope.comment.$getAgent().then(function(response) {
              scope.agent = response.getAgent();
            });
          }

          // set isAuthor
          scope.isAuthor = false;
          fsCurrentUser.get().then(function(currentUser) {
            scope.isAuthor = scope.comment.$getAgentId() === currentUser.id || !scope.comment.$getAgentId(); // new comment
          });

        }
      };
    });
})();