(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsDiscussionsSection', function (fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsDiscussionsSection/fsDiscussionsSection.tpl.html',
        scope: {
          state: '='
        },
        link: function(scope) {
          scope.discussions = [
            {id: 'foo'}
          ];

          _.forEach(scope.discussions, function(discussion) {
            fsItemHelpers.mixinStateFunctions(scope, discussion);
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();