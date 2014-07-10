(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsPersonSmallest', function () {
      return {
        templateUrl: 'fsReferenceClientShared/fsPersonSmallest/fsPersonSmallest.tpl.html',
        scope: {
          person: '='
        }
      };
    });
})();