(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNameEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsName/fsNameEdit/fsNameEdit.tpl.html',
        scope: {
          item: '=',
          save: '&'
        },
        link: function(scope) {
          scope.submit = function () {
            // TBD
          };
        }
      };
    });
})();