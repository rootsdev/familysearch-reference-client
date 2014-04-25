(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSection', function () {
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: 'fsCloneShared/fsSection/fsSection.tpl.html',
        scope: {
          sectionTitle: '@',
          state: '=',
          detailsOpenable: '@',
          hasOpenDetails: '&',
          openDetails: '&'
        },
        link: function(scope, elem, attrs) {
          scope.isOpen = function() {
            return scope.state === 'open';
          };
          scope.isDetailsOpenable = function() {
            return scope.detailsOpenable && scope.isOpen();
          };
          scope.toggleState = function() {
            scope.state = scope.state === 'open' ? 'closed' : 'open';
          };
        }
      };
    });
})();
