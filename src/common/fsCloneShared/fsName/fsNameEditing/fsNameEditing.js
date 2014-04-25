(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNameEditing', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsName/fsNameEditing/fsNameEditing.tpl.html',
        scope: {
          item: '='
        },
        link: function(scope, elem, attrs) {
          scope.cancel = function() {
            scope.item.state = !!scope.item.value ? 'open' : 'closed';
          };
        }
      };
    });
})();