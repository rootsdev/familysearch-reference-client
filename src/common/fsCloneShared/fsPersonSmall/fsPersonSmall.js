(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonSmall', function () {
      return {
        templateUrl: 'fsCloneShared/fsPersonSmall/fsPersonSmall.tpl.html',
        scope: {
          person: '=',
          editParents: '@',
          parentsId: '@',
          isFocus: '@',
          popoverPlacement: '@',
          hidePid: '@'
        },
        link: function(scope) {
          scope.doEditParents = function() {
            scope.$emit('navigate', 'parents', {
              parentsId: scope.parentsId
            });
          };

        }
      };
    });
})();