(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItemDetails', function() {
      return {
        templateUrl: 'fsCloneShared/fsItem/fsItemDetails/fsItemDetails.tpl.html',
        scope: {
          item: '=',
          agent: '=',
          sources: '='
        }
      };
    });
})();