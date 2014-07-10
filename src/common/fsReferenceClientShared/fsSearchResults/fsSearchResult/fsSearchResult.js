(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsSearchResult', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsSearchResults/fsSearchResult/fsSearchResult.tpl.html',
        replace: true,
        scope: {
          result: '='
        }
      };
    });
})();