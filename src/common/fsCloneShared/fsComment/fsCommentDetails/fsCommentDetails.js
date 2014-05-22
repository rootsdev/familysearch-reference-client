(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsCommentDetails', function(fsCurrentUser, fsAgentCache) {
      return {
        templateUrl: 'fsCloneShared/fsComment/fsCommentDetails/fsCommentDetails.tpl.html',
        scope: {
          comment: '='
        },
        link: function(scope) {
          // set agent
          if (scope.comment.$getAgentUrl()) {
            fsAgentCache.getAgent(scope.comment.$getAgentUrl()).then(function(agent) {
              scope.agent = agent;
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