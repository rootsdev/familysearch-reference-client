(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonProfile', function ($state) {
      return {
        templateUrl: 'fsCloneShared/fsPersonProfile/fsPersonProfile.tpl.html',
        scope: {
          person: '='
        },
        link: function(scope) {
          console.log(scope.person);

          scope.navigateToTree = function() {
              $state.go('tree', { personId: scope.person.id });
          };
        }
      };
    });
})();