(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGender', function(fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsGender/fsGender.tpl.html',
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
