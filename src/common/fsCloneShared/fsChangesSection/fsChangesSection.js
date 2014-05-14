(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsChangesSection', function (fsApi, $rootScope) {
      return {
        templateUrl: 'fsCloneShared/fsChangesSection/fsChangesSection.tpl.html',
        scope: {
          person: '='
        },
        link: function(scope) {
          function init() {
            //noinspection JSUnresolvedVariable
            if (!scope.person.living) {
              fsApi.getPersonChanges(scope.person.id, {count: 3}).then(function(response) {
                scope.changes = response.getChanges();
              });
            }
          }

          var unbindSaved = $rootScope.$on('saved', function() {
            console.log('refresh changes');
            init();
          });
          scope.$on('$destroy', unbindSaved);

          var unbindDeleted = $rootScope.$on('deleted', function() {
            console.log('refresh changes');
            init();
          });
          scope.$on('$destroy', unbindDeleted);

          init();
        }
      };
    });
})();