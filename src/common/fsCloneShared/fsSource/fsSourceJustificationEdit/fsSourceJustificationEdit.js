(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceJustificationEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsSource/fsSourceJustificationEdit/fsSourceJustificationEdit.tpl.html',
        scope: {
          sourceRef: '='
        },
        link: function(scope) {
          scope.form = {
            justification: scope.sourceRef.attribution.changeMessage
          };

          scope.save = function() {
            scope.sourceRef.attribution.changeMessage = scope.form.justification;
            scope.$emit('save', scope.sourceRef);
          };

          scope.cancelEdit = function() {
            scope.sourceRef._editingJustification = false;
          };
        }
      };
    });
})();