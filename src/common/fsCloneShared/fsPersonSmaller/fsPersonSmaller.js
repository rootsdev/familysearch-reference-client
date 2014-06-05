(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonSmaller', function () {
      return {
        templateUrl: 'fsCloneShared/fsPersonSmaller/fsPersonSmaller.tpl.html',
        scope: {
          person: '='
        }
      };
    });
})();