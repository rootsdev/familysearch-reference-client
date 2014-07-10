(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsAgentPopover', function () {
      return {
        transclude: true,
        templateUrl: 'fsReferenceClientShared/fsAgentPopover/fsAgentPopover.tpl.html',
        scope: {
          agent: '=',
          popoverPlacement: '@'
        }
      };
    });
})();
