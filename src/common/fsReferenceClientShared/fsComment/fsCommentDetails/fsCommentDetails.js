(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsCommentDetails', function(fsCurrentUserCache, fsAgentCache) {
      return {
        templateUrl: 'fsReferenceClientShared/fsComment/fsCommentDetails/fsCommentDetails.tpl.html',
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
          fsCurrentUserCache.getUser().then(function(currentUser) {
            scope.isAuthor = scope.comment.$getAgentId() === currentUser.id || !scope.comment.$getAgentId(); // new comment
          });

        }
      };
    });
})();