(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsDiscussion', function() {
      return {
        templateUrl: 'fsCloneShared/fsDiscussion/fsDiscussion.tpl.html',
        scope: {
          disc: '='
        },
        link: function(scope) {
          scope.commentsState = {value: 'closed'};

          function setAgent() {
            if (!scope.agent) {
              return scope.disc.discussion.$getAgent().then(function(response) {
                scope.agent = response.getAgent();
              });
            }
            return null;
          }
          scope.disc._onOpen(setAgent);
          scope.disc._onEdit(setAgent);

          scope.save = function () {
            // TBD
          };

          scope.remove = function () {
            // TBD
          };

        }
      };
    });
})();