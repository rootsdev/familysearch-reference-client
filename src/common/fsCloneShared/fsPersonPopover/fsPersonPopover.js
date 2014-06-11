(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonPopover', function (fsApi) {
      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsPersonPopover/fsPersonPopover.tpl.html',
        scope: {
          person: '=',
          popoverPlacement: '@'
        },
        link: function(scope) {
          scope.sourcesCount = null;
          scope.discussionsCount = null;

          scope.focus = function() {
            if (scope.sourcesCount === null) {
                fsApi.getPersonSourceRefs(scope.person.id).then(function(response){
                    scope.sourcesCount = response.getSourceRefs().length;
                });
            }
            if (scope.discussionsCount === null) {
                fsApi.getPersonDiscussionRefs(scope.person.id).then(function(response){
                    scope.discussionsCount = response.getDiscussionRefs().length;
                });
            }
          };

          scope.navigateTo = function() {
            scope.$emit('navigate', 'person', { personId: scope.person.id });
          };

          scope.navigateToTree = function() {
            scope.$emit('navigate', 'tree', { personId: scope.person.id });
          };

        }
      };
    });
})();
