(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceJustificationEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsSource/fsSourceJustificationEdit/fsSourceJustificationEdit.tpl.html',
        scope: {
          source: '='
        },
        link: function(scope, elem, attrs) {
          scope.cancelEdit = function() {
            scope.source._editingJustification = false;
          };

          scope.submit = function() {
            // TBD
          };
        }
      };
    });
})();