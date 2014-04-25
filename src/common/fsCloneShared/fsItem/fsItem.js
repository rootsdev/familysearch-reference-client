(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItem', function () {
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: 'fsCloneShared/fsItem/fsItem.tpl.html',
        scope: {
          state: '=',
          editable: '@',
          deletable: '@',
          exists: '@'
        },
        link: function(scope, elem, attrs) {
          scope.isOpen = function() {
            return scope.state === 'open';
          };

          scope.isEditing = function() {
            return scope.state === 'editing';
          };

          scope.edit = function() {
            scope.state = 'editing';
          };

          scope.remove = function() {
            console.log('fsItem delete');
          };

          scope.close = function() {
            scope.state = 'closed';
          };
        }
      };
    });
})();
