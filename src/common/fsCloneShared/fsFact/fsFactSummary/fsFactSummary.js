(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactSummary', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsFact/fsFactSummary/fsFactSummary.tpl.html',
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
