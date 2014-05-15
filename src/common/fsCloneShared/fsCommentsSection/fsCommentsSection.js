(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsCommentsSection', function (fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsCommentsSection/fsCommentsSection.tpl.html',
        scope: {
          state: '=',
          discussion: '='
        },
        link: function(scope) {

          scope.toggleState = function() {
            scope.state.value = scope.state.value === 'open' ? 'closed' : 'open';
          };

          scope.isOpen = function() {
            return scope.state.value === 'open';
          };

          scope.$watch(function() {
            return scope.state.value;
          }, function(newValue) {
            if (newValue === 'open' && !scope.comments) {
              console.log('getting comments');
              scope.state.value = 'loading';
              scope.comments = [];
              scope.discussion.$getComments().then(function(response) {
                scope.comments = response.getComments();
                console.log('got comments', scope.comments);
                _.forEach(scope.comments, function(comment) {
                  fsItemHelpers.mixinStateFunctions(scope, comment);
                });
                scope.state.value = 'open';
              });
            }
          });

        }
      };
    });
})();