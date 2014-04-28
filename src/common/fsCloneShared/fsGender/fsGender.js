(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGender', function() {
      return {
        templateUrl: 'fsCloneShared/fsGender/fsGender.tpl.html',
        scope: {
          item: '='
        },
        link: function(scope) {
          scope.save = function () {
            // TBD
          };

        }
      };
    });
})();
