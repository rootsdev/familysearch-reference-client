(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNameSummary', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsName/fsNameSummary/fsNameSummary.tpl.html',
        scope: {
          item: '='
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
