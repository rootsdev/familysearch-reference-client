(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFact', function() {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFact.tpl.html',
        scope: {
          item: '='
        },
        link: function(scope) {
          scope.getDisplayType = function(item) {
            return item.type.substring(item.type.lastIndexOf('/')+1);
          };

          scope.save = function () {
            // TBD
          };

          scope.remove = function () {
            // TBD
          };

        }
      };
    });
})();