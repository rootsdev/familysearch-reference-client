(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsComment', function() {
      return {
        templateUrl: 'fsCloneShared/fsComment/fsComment.tpl.html',
        scope: {
          comment: '='
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