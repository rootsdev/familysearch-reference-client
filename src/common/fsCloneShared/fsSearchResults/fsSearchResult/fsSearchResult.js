(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSearchResult', function() {
      return {
        templateUrl: 'fsCloneShared/fsSearchResults/fsSearchResult/fsSearchResult.tpl.html',
        replace: true,
        scope: {
          result: '='
        }
      };
    });
})();