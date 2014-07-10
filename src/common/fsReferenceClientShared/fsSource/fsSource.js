(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsSource', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsSource/fsSource.tpl.html',
        scope: {
          source: '=',
          hideTags: '@'
        }
      };
    });
})();