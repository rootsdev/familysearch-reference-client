(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceDescriptionSummary', function() {
      return {
        templateUrl: 'fsCloneShared/fsSourceDescription/fsSourceDescriptionSummary/fsSourceDescriptionSummary.tpl.html',
        scope: {
          description: '='
        }
      };
    });
})();