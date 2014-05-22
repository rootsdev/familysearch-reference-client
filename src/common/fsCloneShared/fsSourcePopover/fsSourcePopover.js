(function(){
  'use strict';
  angular.module('fsCloneShared')
    .config(function($tooltipProvider){
      $tooltipProvider.setTriggers({
        'fsSourcePopoverShow': 'blur'
      });
    })

    .directive('fsSourcePopover', function (fsUtils, fsAgentCache) {
      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsSourcePopover/fsSourcePopover.tpl.html',
        scope: {
          source: '='
        },
        link: function(scope, element) {
          var el = fsUtils.findElement(element, 'fsSourcePopover');

          scope.show = function() {
            // set agent
            if (!scope.agent && !!scope.source.ref.attribution) {
              fsAgentCache.getAgent(scope.source.ref.attribution.$getAgentUrl()).then(function(agent) {
                scope.agent = agent;
              });
            }

            setTimeout(function() { // popover expects to be triggered outside of angular
              el.triggerHandler('fsSourcePopoverShow');
            }, 0);
          };

        }
      };
    });
})();
