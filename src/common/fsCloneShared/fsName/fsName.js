(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsName', function(fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsName/fsName.tpl.html',
        scope: {
          name: '='
        },
        link: function(scope) {
          fsItemHelpers.mixinAgentFunctions(scope, function() { return scope.name; });

          scope.save = function () {
            // TBD
          };

        }
      };
    });
})();
