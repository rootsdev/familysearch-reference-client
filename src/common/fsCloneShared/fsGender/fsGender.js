(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGender', function(fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsGender/fsGender.tpl.html',
        scope: {
          gender: '=',
          sourceRefs: '='
        },
        link: function(scope) {
          scope.gender._onOpen(fsItemHelpers.agentSetter(scope));

          scope.save = function () {
            // TBD
          };

        }
      };
    });
})();
