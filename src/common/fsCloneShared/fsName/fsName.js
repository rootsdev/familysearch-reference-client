(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsName', function(fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsName/fsName.tpl.html',
        scope: {
          name: '=',
          sourceRefs: '='
        },
        link: function(scope) {
          scope.name._onOpen(fsItemHelpers.agentSetter(scope));

          scope.save = function () {
            // TBD
          };

        }
      };
    });
})();
