(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsName', function(fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsName/fsName.tpl.html',
        scope: {
          item: '='
        },
        link: function(scope) {
          scope.agent = null;
          scope.setAgent = function(item) {
            fsItemHelpers.setAgent(scope, item);
          };

          scope.save = function () {
            // TBD
          };

        }
      };
    });
})();
