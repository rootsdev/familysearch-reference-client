(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsSourceSummary', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsSource/fsSourceSummary/fsSourceSummary.tpl.html',
        scope: {
          source: '='
        }
      };
    });
})();