(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourcesSection', function (fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsSourcesSection/fsSourcesSection.tpl.html',
        scope: {
          state: '='
        },
        link: function(scope, elem, attrs) {
          scope.sources = [
            {id: 'foo', title: 'My Title'}
          ];

          _.forEach(scope.sources, function(source) {
            fsItemHelpers.mixinStateFunctions(source);
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();