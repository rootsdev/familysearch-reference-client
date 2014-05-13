(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFact', function(fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFact.tpl.html',
        scope: {
          fact: '=',
          person: '=',
          sourceRefs: '='
        },
        link: function(scope) {
          scope.fact._onOpen(fsItemHelpers.agentSetter(scope));
          scope.fact._onEdit(fsItemHelpers.agentSetter(scope));

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