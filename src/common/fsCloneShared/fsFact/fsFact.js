(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFact', function(fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFact.tpl.html',
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

          scope.remove = function () {
            // TBD
          };

        }
      };
    });
})();