(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGenderEditing', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsGender/fsGenderEditing/fsGenderEditing.tpl.html',
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