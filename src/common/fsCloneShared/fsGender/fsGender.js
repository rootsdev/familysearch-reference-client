(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGender', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsGender/fsGender.tpl.html',
        scope: {
          item: '='
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
