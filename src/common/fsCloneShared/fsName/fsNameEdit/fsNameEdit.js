(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNameEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsName/fsNameEdit/fsNameEdit.tpl.html',
        scope: {
          name: '=',
          agent: '='
        },
        link: function(scope) {
          scope.form = {
            prefix: scope.name.$getPrefix(),
            given: scope.name.$getGivenName(),
            surname: scope.name.$getSurname(),
            suffix: scope.name.$getSuffix()
          };

        }
      };
    });
})();