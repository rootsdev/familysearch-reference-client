(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsChangesSection', function (fsApi) {
      return {
        templateUrl: 'fsCloneShared/fsChangesSection/fsChangesSection.tpl.html',
        scope: {
          person: '='
        },
        link: function(scope) {
          //noinspection JSUnresolvedVariable
          if (!scope.person.living) {
            fsApi.getPersonChanges(scope.person.id, {count: 3}).then(function(response) {
              scope.changes = response.getChanges();
            });
          }
        }
      };
    });
})();