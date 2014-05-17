(function(){
  'use strict';
  angular.module('fsCloneShared')
    .config(function($tooltipProvider){
      $tooltipProvider.setTriggers({
        'fsSourceTagsPopoverShow': 'fsSourceTagsPopoverHide'
      });
    })

    .directive('fsSourceTagsPopover', function (_, fsTagTypes, fsUtils) {

      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsSourceTagsPopover/fsSourceTagsPopover.tpl.html',
        scope: {
          sourceRef: '='
        },
        link: function(scope, element) {
          var el = fsUtils.findElement(element, 'fsSourceTagsPopover');

          scope.show = function() {
            // set form from sourceRef
            var tags = scope.sourceRef.$getTags();
            scope.form = _.map(fsTagTypes, function(tagType) {
              return {
                type: tagType,
                value: _.contains(tags, tagType)
              };
            });

            setTimeout(function() { // popover expects to be triggered outside of angular
              el.triggerHandler('fsSourceTagsPopoverShow');
            }, 0);
          };

          scope.save = function() {
            // set sourceRef from form
            scope.sourceRef.$setTags(
              _.map(_.filter(scope.form, { value: true }), function(tag) {
                return tag.type;
              }));
            scope.$emit('save', scope.sourceRef);
            scope.cancel(); // close popover
          };

          scope.cancel = function() {
            setTimeout(function() {
              el.triggerHandler('fsSourceTagsPopoverHide');
            }, 0);
          };

        }
      };
    });
})();
