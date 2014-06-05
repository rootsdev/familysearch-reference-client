(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsChangesSection', function (fsApi, $rootScope, fsChangeHistoryModal) {
      return {
        templateUrl: 'fsCloneShared/fsChangesSection/fsChangesSection.tpl.html',
        scope: {
          person: '=', // pass in person or couple+husband+wife or parents+child+father+mother
          couple: '=',
          husband: '=',
          wife: '=',
          parents: '=',
          child: '=',
          father: '=',
          mother: '='
        },
        link: function(scope) {
          scope.isLiving = function() {
            return !!scope.person && scope.person.living;
          };

          function init() {
            //noinspection JSUnresolvedVariable
            if (!scope.isLiving()) {
              var promise;
              var params = {count: 3};
              if (!!scope.person) {
                promise = fsApi.getPersonChanges(scope.person.id, params);
              }
              else if (!!scope.couple) {
                promise = fsApi.getCoupleChanges(scope.couple.id, params);
              }
              else if (!!scope.parents) {
                promise = fsApi.getChildAndParentsChanges(scope.parents.id, params);
              }
              promise.then(function(response) {
                scope.changes = response.getChanges();
              });
            }
          }

          scope.showChangesModal = function() {
            fsChangeHistoryModal.open({
              person: scope.person,
              couple: scope.couple,
              husband: scope.husband,
              wife: scope.wife,
              parents: scope.parents,
              child: scope.child,
              father: scope.father,
              mother: scope.mother
            });
          };

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