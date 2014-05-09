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
          fsItemHelpers.mixinAgentFunctions(scope, function() { return scope.gender; });

          scope.save = function () {
            // TBD
          };

        }
      };
    });
})();
