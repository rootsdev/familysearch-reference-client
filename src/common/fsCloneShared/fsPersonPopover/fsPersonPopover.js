(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonPopover', function (fsApi, $window) {

      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsPersonPopover/fsPersonPopover.tpl.html',
        scope: {
          person: '=',
          popoverPlacement: '@'
        },
        link: function(scope, element) {
          scope.sourcesCount = null;
          scope.discussionsCount = null;

          scope.expectedWidth = 400;    // ick! -- must be a better way to get these sizes
          scope.expectedHeight = 240;

          function noopAdjustor() {
            return scope.popoverPlacement;
          }
          scope.placementAdjustor = noopAdjustor();


          var autoToken = /\s?auto?\s?/i;
          var autoPlace = autoToken.test(scope.popoverPlacement);
          if ( autoPlace ) {
            scope.popoverPlacement = scope.popoverPlacement.replace(autoToken,'') || 'top';

            switch(scope.popoverPlacement) {
              case 'top':
                scope.placementAdjustor = function() {
                  return (element[0].getBoundingClientRect().top - scope.expectedHeight < 0 ) ? 'bottom' : 'top';
                };
                break;
              case 'left':
                scope.placementAdjustor = function() {return (element[0].getBoundingClientRect().left - scope.expectedWidth < 0 ) ? 'right' : 'left'; };
                break;
              case 'right':
                scope.placementAdjustor = function() {return (element[0].getBoundingClientRect().right + scope.expectedWidth >= angular.element($window).width() ) ? 'left' : 'right'; };
                break;
              case 'bottom':
                scope.placementAdjustor = function() {return (element[0].getBoundingClientRect().bottom +scope.expectedHeight >= angular.element($window).height() ) ? 'top' : 'bottom'; };
                break;
            }
          }


          scope.focus = function() {
            if (scope.sourcesCount === null) {
                fsApi.getPersonSourceRefs(scope.person.id).then(function(response){
                    scope.sourcesCount = response.getSourceRefs().length;
                });
            }
            if (scope.discussionsCount === null) {
                fsApi.getPersonDiscussionRefs(scope.person.id).then(function(response){
                    scope.discussionsCount = response.getDiscussionRefs().length;
                });
            }

            scope.popoverPlacement = scope.placementAdjustor();
          };

          scope.navigateTo = function() {
            scope.$emit('navigate', 'person', { personId: scope.person.id });
          };

          scope.navigateToTree = function() {
            scope.$emit('navigate', 'tree', { personId: scope.person.id });
          };

        }
      };
    });
})();
