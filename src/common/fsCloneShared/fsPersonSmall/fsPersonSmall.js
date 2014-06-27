(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonSmall', function (fsLocation) {
      return {
        templateUrl: 'fsCloneShared/fsPersonSmall/fsPersonSmall.tpl.html',
        scope: {
          person: '=',
          editParents: '@',
          parentsId: '@',
          isFocus: '@',
          popoverPlacement: '@',
          hidePopover: '@',
          hidePid: '@'
        },
        link: function(scope) {
          scope.parentsHref = fsLocation.getParentsUrl(scope.parentsId);

        }
      };
    });
})();