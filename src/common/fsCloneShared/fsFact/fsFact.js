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
          // TODO fsItemHelpers.mixinAgentFunctions(state)
          scope.agent = null;
          scope.setAgent = function(fact) {
            fsItemHelpers.setAgent(scope, fact);
          };

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