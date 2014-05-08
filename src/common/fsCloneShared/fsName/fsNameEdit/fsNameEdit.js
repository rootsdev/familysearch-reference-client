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
          scope.form = {
            prefix: scope.item.$getPrefix(),
            given: scope.item.$getGivenName(),
            surname: scope.item.$getSurname(),
            suffix: scope.item.$getSuffix()
          };

          scope.submit = function () {
            // TBD
          };
        }
      };
    });
})();