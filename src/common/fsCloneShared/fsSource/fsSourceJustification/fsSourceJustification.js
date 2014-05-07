(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceJustification', function() {
      return {
        templateUrl: 'fsCloneShared/fsSource/fsSourceJustification/fsSourceJustification.tpl.html',
        scope: {
          item: '=',
          editable: '@'
        },
        link: function(scope, elem, attrs) {
          scope.edit = function() {
            scope.item._editingJustification = true;
          };

        }
      };
    });
})();