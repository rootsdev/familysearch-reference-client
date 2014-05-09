(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceJustification', function() {
      return {
        templateUrl: 'fsCloneShared/fsSource/fsSourceJustification/fsSourceJustification.tpl.html',
        scope: {
          source: '=',
          editable: '@'
        },
        link: function(scope) {
          scope.edit = function() {
            scope.source._editingJustification = true;
          };

        }
      };
    });
})();