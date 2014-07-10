(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsPersonPopover', function (fsApi, $window, fsLocation) {

      return {
        transclude: true,
        templateUrl: 'fsReferenceClientShared/fsPersonPopover/fsPersonPopover.tpl.html',
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
          scope.placementAdjustor = noopAdjustor;


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

          scope.$watch(function() {
            return scope.person;
          }, function() {
            if (!!scope.person) {
              scope.personHref = fsLocation.getPersonUrl(scope.person.id);
              scope.treeHref = fsLocation.getTreeUrl(scope.person.id);
            }
          });

        }
      };
    });
})();
