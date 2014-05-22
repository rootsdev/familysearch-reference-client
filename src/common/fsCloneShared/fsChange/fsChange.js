(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsChange', function (fsAgentCache) {
      return {
        templateUrl: 'fsCloneShared/fsChange/fsChange.tpl.html',
        scope: {
          change: '='
        },
        link: function(scope) {
          scope.setAgent = function() {
            if (!scope.agent) {
              fsAgentCache.getAgent(scope.change.$getAgentUrl()).then(function(agent) {
                scope.agent = agent;
              });
            }
          };
        }
      };
    });
})();