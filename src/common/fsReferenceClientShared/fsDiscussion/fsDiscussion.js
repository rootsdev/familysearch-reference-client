(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsDiscussion', function(fsCurrentUserCache, fsAgentCache) {
      return {
        templateUrl: 'fsReferenceClientShared/fsDiscussion/fsDiscussion.tpl.html',
        scope: {
          disc: '='
        },
        link: function(scope) {
          scope.commentsState = {value: 'closed'};

          // set agent
          function setAgent(disc) {
            if (!scope.agent && disc.discussion.$getAgentUrl()) {
              disc._busy = true;
              return fsAgentCache.getAgent(disc.discussion.$getAgentUrl()).then(function(agent) {
                disc._busy = false;
                scope.agent = agent;
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
              fsCurrentUserCache.getUser().then(function(currentUser) {
                scope.isAuthor = scope.disc.discussion.$getAgentId() === currentUser.id;
              });
            }
          });

        }
      };
    });
})();