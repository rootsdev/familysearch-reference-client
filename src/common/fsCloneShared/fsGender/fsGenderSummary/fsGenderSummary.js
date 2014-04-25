(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGenderSummary', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsGender/fsGenderSummary/fsGenderSummary.tpl.html',
        scope: {
          item: '=',
          type: '@'
        },
        link: function(scope, elem, attrs) {
          scope.toggleOpen = function() {
            scope.item.state = scope.item.state === 'open' ? 'closed' : 'open';
          };

          scope.edit = function() {
            scope.item.state = 'editing';
          };
        }
      };
    });
})();
