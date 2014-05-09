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
          // TODO fsItemHelpers.mixinAgentFunctions(state)
          scope.agent = null;
          scope.setAgent = function(name) {
            fsItemHelpers.setAgent(scope, name);
          };

          scope.save = function () {
            // TBD
          };

        }
      };
    });
})();
