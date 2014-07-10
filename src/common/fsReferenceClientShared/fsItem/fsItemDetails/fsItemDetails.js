(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsItemDetails', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsItem/fsItemDetails/fsItemDetails.tpl.html',
        scope: {
          person: '=',
          item: '=',
          agent: '=',
          sources: '=',
          showHistory: '@'
        }
      };
    });
})();