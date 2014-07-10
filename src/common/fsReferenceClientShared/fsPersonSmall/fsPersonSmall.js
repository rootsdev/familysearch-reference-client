(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsPersonSmall', function (fsLocation) {
      return {
        templateUrl: 'fsReferenceClientShared/fsPersonSmall/fsPersonSmall.tpl.html',
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