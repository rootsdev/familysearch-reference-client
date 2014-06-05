(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonSmall', function ($state) {
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
            $state.go('parents', {
              parentsId: scope.parentsId
            });
          };

        }
      };
    });
})();