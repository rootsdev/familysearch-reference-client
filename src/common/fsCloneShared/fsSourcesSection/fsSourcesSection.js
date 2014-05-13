(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourcesSection', function (fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsSourcesSection/fsSourcesSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {
          scope.sources = [];
          scope.person.$getSourceRefs().then(function(response) {
            response.getSourceRefs().forEach(function(sourceRef) {
              sourceRef.$getSourceDescription().then(function(response) {
                var source = {
                  ref: sourceRef,
                  description: response.getSourceDescription()
                };
                fsItemHelpers.mixinStateFunctions(scope, source);
                scope.sources.push(source);
              });
            });
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();