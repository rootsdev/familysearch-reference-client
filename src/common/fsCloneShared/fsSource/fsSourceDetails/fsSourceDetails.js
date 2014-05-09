(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceDetails', function() {
      return {
        templateUrl: 'fsCloneShared/fsSource/fsSourceDetails/fsSourceDetails.tpl.html',
        scope: {
          source: '='
        }
      };
    });
})();