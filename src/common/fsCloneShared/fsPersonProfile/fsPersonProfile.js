(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonProfile', function () {
      return {
        templateUrl: 'fsCloneShared/fsPersonProfile/fsPersonProfile.tpl.html',
        scope: {
          person: '='
        },
        link: function(scope) {
          scope.navigateToTree = function() {
            scope.$emit('navigate', 'tree', { personId: scope.person.id });
          };
        }
      };
    });
})();