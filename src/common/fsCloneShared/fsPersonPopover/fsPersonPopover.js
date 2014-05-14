(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonPopover', function (fsApi, $state) {
      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsPersonPopover/fsPersonPopover.tpl.html',
        scope: {
          person: '='
        },
        link: function(scope) {
          scope.sourcesCount = null;
          scope.discussionsCount = null;

          scope.focus = function() {
            if (scope.sourcesCount === null) {
                fsApi.getPersonSourceRefs(scope.person.id).then(function(response){
                    scope.sourcesCount = response ? response.getSourceRefs().length : 0;
                });
            }
            if (scope.discussionsCount === null) {
                fsApi.getPersonDiscussionRefs(scope.person.id).then(function(response){
                    scope.discussionsCount = response ? response.getDiscussionRefs().length : 0;
                });
            }
          };

          scope.navigateTo = function() {
              $state.go('person', { personId: scope.person.id });
          };

          scope.navigateToTree = function() {
              $state.go('tree', { personId: scope.person.id });
          };

        }
      };
    });
})();
