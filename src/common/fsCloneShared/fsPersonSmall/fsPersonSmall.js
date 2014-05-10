(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonSmall', function () {
      return {
        templateUrl: 'fsCloneShared/fsPersonSmall/fsPersonSmall.tpl.html',
        scope: {
          person: '=',
          editParents: '@',
          showPopover: '@',
          defaultGender: '@'
        },
        link: function(scope) {
          console.log('fsPersonSmall', scope.showPopover, scope.defaultGender, scope.person);
        }
      };
    });
})();