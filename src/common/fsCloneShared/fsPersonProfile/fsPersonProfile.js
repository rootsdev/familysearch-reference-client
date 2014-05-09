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
          console.log(scope.person);
        }
      };
    });
})();