(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsPersonProfile', function (fsLocation) {
      return {
        templateUrl: 'fsReferenceClientShared/fsPersonProfile/fsPersonProfile.tpl.html',
        scope: {
          person: '='
        },
        link: function(scope) {
          scope.treeHref = fsLocation.getTreeUrl(scope.person.id);
        }
      };
    });
})();