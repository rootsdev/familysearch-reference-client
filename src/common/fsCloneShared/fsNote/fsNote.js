(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNote', function() {
      return {
        templateUrl: 'fsCloneShared/fsNote/fsNote.tpl.html',
        scope: {
          note: '='
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