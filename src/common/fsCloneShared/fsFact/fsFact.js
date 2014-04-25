(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFact', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsFact/fsFact.tpl.html',
        scope: {
          item: '=',
          type: '@'
        },
        link: function(scope, elem, attrs) {
          scope.isOpen = function() {
            return scope.item.state === 'open';
          };

          scope.isEditing = function() {
            return scope.item.state === 'editing';
          };
        }
      };
    });
})();
