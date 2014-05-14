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
          scope.comment.$getAgent().then(function(response) {
            scope.agent = response.getAgent();
          });

          scope.isAuthor = false;
          fsCurrentUser.get().then(function(currentUser) {
            scope.isAuthor = scope.comment.$getAgentId() === currentUser.id;
          });

        }
      };
    });
})();