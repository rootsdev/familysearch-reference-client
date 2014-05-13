(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsAgentPopover', function () {
      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsAgentPopover/fsAgentPopover.tpl.html',
        scope: {
          agent: '='
        },
        link: function() {
        }
      };
    });
})();
