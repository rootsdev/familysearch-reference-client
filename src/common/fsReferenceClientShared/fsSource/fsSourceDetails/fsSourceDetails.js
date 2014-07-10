(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsSourceDetails', function(fsAgentCache) {
      return {
        templateUrl: 'fsReferenceClientShared/fsSource/fsSourceDetails/fsSourceDetails.tpl.html',
        scope: {
          source: '=',
          hideTags: '@'
        },
        link: function(scope) {
          scope.source._onOpen(function(source) {
            if (source.ref.attribution && !scope.agent) {
              return fsAgentCache.getAgent(source.ref.attribution.$getAgentUrl() || source.ref.attribution.$getAgentId())
                .then(function(agent) {
                  scope.agent = agent;
                });
            }
            return null;
          });

        }
      };
    });
})();