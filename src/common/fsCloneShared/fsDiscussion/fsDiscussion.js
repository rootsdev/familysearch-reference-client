(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsDiscussion', function(fsCurrentUser) {
      return {
        templateUrl: 'fsCloneShared/fsDiscussion/fsDiscussion.tpl.html',
        scope: {
          disc: '='
        },
        link: function(scope) {
          scope.commentsState = {value: 'closed'};

          // set agent
          function setAgent(disc) {
            if (!scope.agent && disc.discussion.$getAgentId()) {
              disc._busy = true;
              return disc.discussion.$getAgent().then(function(response) {
                disc._busy = false;
                scope.agent = response.getAgent();
              });
            }
            return null;
          }
          scope.disc._onOpen(setAgent);
          scope.disc._onEdit(setAgent);

          // set isAuthor
          scope.isAuthor = null;
          scope.disc._onOpen(function() {
            if (scope.isAuthor === null && scope.disc.discussion.$getAgentId()) {
              fsCurrentUser.get().then(function(currentUser) {
                scope.isAuthor = scope.disc.discussion.$getAgentId() === currentUser.id;
              });
            }
          });

        }
      };
    });
})();