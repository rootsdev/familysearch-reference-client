(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNameSummary', function() {
      return {
        templateUrl: 'fsCloneShared/fsName/fsNameSummary/fsNameSummary.tpl.html',
        scope: {
          name: '='
        }
      };
    });
})();
