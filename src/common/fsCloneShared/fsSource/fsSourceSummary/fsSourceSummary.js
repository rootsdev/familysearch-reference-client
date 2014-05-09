(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceSummary', function() {
      return {
        templateUrl: 'fsCloneShared/fsSource/fsSourceSummary/fsSourceSummary.tpl.html',
        scope: {
          source: '='
        }
      };
    });
})();