(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsDiscussion', function() {
      return {
        templateUrl: 'fsCloneShared/fsDiscussion/fsDiscussion.tpl.html',
        scope: {
          item: '='
        },
        link: function(scope) {
          scope.commentsState = 'closed';

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