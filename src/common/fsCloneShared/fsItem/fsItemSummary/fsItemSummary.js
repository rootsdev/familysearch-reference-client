(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItemSummary', function() {
      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsItem/fsItemSummary/fsItemSummary.tpl.html',
        scope: {
          item: '=',
          label: '@'
        }
      };
    });
})();
