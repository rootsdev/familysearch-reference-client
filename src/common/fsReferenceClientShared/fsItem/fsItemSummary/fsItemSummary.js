(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsItemSummary', function() {
      return {
        transclude: true,
        templateUrl: 'fsReferenceClientShared/fsItem/fsItemSummary/fsItemSummary.tpl.html',
        scope: {
          item: '=',
          label: '@',
          addable: '@',
          linkLabel: '@'
        }
      };
    });
})();
