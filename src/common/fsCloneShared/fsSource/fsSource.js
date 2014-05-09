(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSource', function() {
      return {
        templateUrl: 'fsCloneShared/fsSource/fsSource.tpl.html',
        scope: {
          source: '='
        },
        link: function(scope) {
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