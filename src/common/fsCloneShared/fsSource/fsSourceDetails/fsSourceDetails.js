(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceDetails', function(fsAgentCache) {
      return {
        templateUrl: 'fsCloneShared/fsSource/fsSourceDetails/fsSourceDetails.tpl.html',
        scope: {
          source: '=',
          hideTags: '@'
        },
        link: function(scope) {
          scope.source._onOpen(function(source) {
            if (source.ref.attribution && !scope.agent) {
              return fsAgentCache.getAgent(source.ref.attribution.$getAgentUrl()).then(function(agent) {
                scope.agent = agent;
              });
            }
            return null;
          });

        }
      };
    });
})();