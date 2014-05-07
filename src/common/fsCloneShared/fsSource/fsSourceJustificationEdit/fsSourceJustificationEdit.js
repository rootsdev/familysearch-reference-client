(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceJustificationEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsSource/fsSourceJustificationEdit/fsSourceJustificationEdit.tpl.html',
        scope: {
          item: '='
        },
        link: function(scope, elem, attrs) {
          scope.cancelEdit = function() {
            scope.item._editingJustification = false;
          };

          scope.submit = function() {
            // TBD
          };
        }
      };
    });
})();