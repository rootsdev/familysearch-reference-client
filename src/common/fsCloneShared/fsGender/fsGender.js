(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGender', function(fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsGender/fsGender.tpl.html',
        scope: {
          gender: '='
        },
        link: function(scope) {
          // TODO fsItemHelpers.mixinAgentFunctions(state)
          scope.agent = null;
          scope.setAgent = function(gender) {
            fsItemHelpers.setAgent(scope, gender);
          };

          scope.save = function () {
            // TBD
          };

        }
      };
    });
})();
