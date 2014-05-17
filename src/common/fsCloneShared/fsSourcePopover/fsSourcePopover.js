(function(){
  'use strict';
  angular.module('fsCloneShared')
    .config(function($tooltipProvider){
      $tooltipProvider.setTriggers({
        'fsSourcePopoverShow': 'blur'
      });
    })

    .directive('fsSourcePopover', function (fsUtils) {
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
              scope.source.ref.attribution.$getAgent().then(function(response) {
                scope.agent = response.getAgent();
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
