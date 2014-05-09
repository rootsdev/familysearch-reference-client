(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsCommentsSection', function (fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsCommentsSection/fsCommentsSection.tpl.html',
        scope: {
          state: '='
        },
        link: function(scope) {
          scope.toggleState = function() {
            scope.state = scope.state === 'open' ? 'closed' : 'open';
          };

          scope.isOpen = function() {
            return scope.state === 'open';
          };

          scope.comments = [
            {id: 'foo'},
            {id: 'bar'}
          ];

          _.forEach(scope.comments, function(comment) {
            fsItemHelpers.mixinStateFunctions(comment);
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();