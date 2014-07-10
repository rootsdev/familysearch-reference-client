(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsSourceJustification', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsSource/fsSourceJustification/fsSourceJustification.tpl.html',
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