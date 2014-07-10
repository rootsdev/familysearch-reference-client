(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .config(function($tooltipProvider){
      $tooltipProvider.setTriggers({
        'fsSourceTagsPopoverShow': 'fsSourceTagsPopoverHide'
      });
    })

    .directive('fsSourceTagsPopover', function (_, fsUtils) {

      return {
        transclude: true,
        templateUrl: 'fsReferenceClientShared/fsSourceTagsPopover/fsSourceTagsPopover.tpl.html',
        scope: {
          item: '=',
          sources: '='
        },
        link: function(scope, element) {
          var el = fsUtils.findElement(element, 'fsSourceTagsPopover');
          var tag = fsUtils.getItemTag(scope.item);

          scope.show = function() {
            // set form from sources
            scope.form = {
              sources: _.map(scope.sources, function(source) {
                return {
                  id: source.id,
                  tagged: _.contains(source.ref.$getTags(), tag),
                  title: source.description.$getTitle()
                };
              })
            };

            setTimeout(function() { // popover expects to be triggered outside of angular
              el.triggerHandler('fsSourceTagsPopoverShow');
            }, 0);
          };

          scope.save = function() {
            var changedSourceRefs = [];
            scope.form.sources.forEach(function(formSource) {
              var source = fsUtils.findById(scope.sources, formSource.id);
              var tags = source.ref.$getTags();
              if (formSource.tagged && !_.contains(tags, tag)) {
                source.ref.$addTag(tag);
                changedSourceRefs.push(source.ref);
              }
              else if (!formSource.tagged && _.contains(tags, tag)) {
                source.ref.$removeTag(tag);
                changedSourceRefs.push(source.ref);
              }
            });
            if (changedSourceRefs.length > 0) {
              scope.$emit('save', changedSourceRefs);
            }
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
