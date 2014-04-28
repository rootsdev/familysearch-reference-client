(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGenderSummary', function() {
      return {
        templateUrl: 'fsCloneShared/fsGender/fsGenderSummary/fsGenderSummary.tpl.html',
        scope: {
          item: '='
        }
      };
    });
})();
