(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonProfile', function (fsLocation) {
      return {
        templateUrl: 'fsCloneShared/fsPersonProfile/fsPersonProfile.tpl.html',
        scope: {
          person: '='
        },
        link: function(scope) {
          scope.treeHref = fsLocation.getTreeUrl(scope.person.id);
        }
      };
    });
})();