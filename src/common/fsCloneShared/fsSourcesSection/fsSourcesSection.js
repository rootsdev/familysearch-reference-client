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
          //noinspection JSUnresolvedVariable
          if (!scope.person.living) {
            scope.person.$getSourceRefs().then(function(response) {
              response.getSourceRefs().forEach(function(sourceRef) {
                var source = {
                  ref: sourceRef,
                  description: response.getSourceDescription(sourceRef.$sourceDescriptionId),
                  id: sourceRef.id
                };
                fsItemHelpers.mixinStateFunctions(scope, source);
                scope.sources.push(source);
              });
            });
          }

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();