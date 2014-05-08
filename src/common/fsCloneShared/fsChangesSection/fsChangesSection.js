(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsChangesSection', function (fsApi) {
      return {
        templateUrl: 'fsCloneShared/fsChangesSection/fsChangesSection.tpl.html',
        scope: {
          pid: '='
        },
        link: function(scope) {
          fsApi.getPersonChanges(scope.pid, {count: 3}).then(function(response) {
            scope.changes = response.getChanges();
          });
        }
      };
    });
})();