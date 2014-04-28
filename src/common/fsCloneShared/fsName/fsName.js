(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsName', function() {
      return {
        templateUrl: 'fsCloneShared/fsName/fsName.tpl.html',
        scope: {
          item: '='
        },
        link: function(scope) {
          scope.save = function () {
            // TBD
          };

        }
      };
    });
})();
