(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourcePopover', function () {
      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsSourcePopover/fsSourcePopover.tpl.html',
        scope: {
          source: '='
        }
      };
    });
})();
