(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonPopover', function () {
      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsPersonPopover/fsPersonPopover.tpl.html',
        scope: {
          person: '='
        },
        link: function(scope, elem, attrs) {
          scope.sourcesCount = null;
          scope.notesCount = null;

          scope.focus = function() {
            if (scope.sourcesCount === null) {
              scope.sourcesCount = 2; // fetch count
            }
            if (scope.notesCount === null) {
              scope.notesCount = 3; // fetch count
            }
          };
        }
      };
    });
})();
