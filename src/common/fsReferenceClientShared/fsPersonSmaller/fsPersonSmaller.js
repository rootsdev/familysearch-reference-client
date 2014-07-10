(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsPersonSmaller', function () {
      return {
        templateUrl: 'fsReferenceClientShared/fsPersonSmaller/fsPersonSmaller.tpl.html',
        scope: {
          person: '='
        }
      };
    });
})();