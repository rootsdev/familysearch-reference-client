(function(){
  'use strict';
  angular.module('fsCloneShared')
    .config(function($tooltipProvider){
      $tooltipProvider.setTriggers({
        'fsSourceTagsPopoverShow': 'fsSourceTagsPopoverHide'
      });
    })

    .directive('fsSourceTagsPopover', function (_, fsTagTypes) {

      function findPopoverElement(element) {
        var spans = element.find('span');
        for (var i = 0, len = spans.length; i < len; i++) {
          if (spans[i].className.indexOf('fsSourceTagsPopover') >= 0) {
            return angular.element(spans[i]);
          }
        }
        return null;
      }

      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsSourceTagsPopover/fsSourceTagsPopover.tpl.html',
        scope: {
          sourceRef: '='
        },
        link: function(scope, element) {
          var el = findPopoverElement(element);

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
