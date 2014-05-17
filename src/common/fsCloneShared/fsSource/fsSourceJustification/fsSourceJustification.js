(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceJustification', function() {
      return {
        templateUrl: 'fsCloneShared/fsSource/fsSourceJustification/fsSourceJustification.tpl.html',
        scope: {
          sourceRef: '=',
          editable: '@'
        },
        link: function(scope) {
          scope.edit = function() {
            scope.sourceRef._editingJustification = true;
          };

        }
      };
    });
})();