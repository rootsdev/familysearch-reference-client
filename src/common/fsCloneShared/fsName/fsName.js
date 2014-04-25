(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsName', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsName/fsName.tpl.html',
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
