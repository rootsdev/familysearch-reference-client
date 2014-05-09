(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFact', function(fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFact.tpl.html',
        scope: {
          fact: '='
        },
        link: function(scope) {
          fsItemHelpers.mixinAgentFunctions(scope, function() { return scope.fact; });

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