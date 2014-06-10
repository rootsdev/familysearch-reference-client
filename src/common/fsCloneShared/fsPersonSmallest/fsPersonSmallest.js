(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonSmallest', function () {
      return {
        templateUrl: 'fsCloneShared/fsPersonSmallest/fsPersonSmallest.tpl.html',
        scope: {
          person: '='
        }
      };
    });
})();