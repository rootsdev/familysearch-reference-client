(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactEditing', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsFact/fsFactEditing/fsFactEditing.tpl.html',
        scope: {
          item: '=',
          type: '@'
        },
        link: function(scope, elem, attrs) {
          scope.cancel = function() {
            scope.item.state = !!scope.item.value ? 'open' : 'closed';
          };
        }
      };
    });
})();