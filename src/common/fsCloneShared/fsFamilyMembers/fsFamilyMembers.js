(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFamilyMembers', function (fsApi) {
      return {
        templateUrl: 'fsCloneShared/fsFamilyMembers/fsFamilyMembers.tpl.html',
        scope: {
          husband: '=',
          wife: '=',
          focusId: '=',
          relationshipId: '=',
          preferredRelationshipId: '=',
          childrenPrefetch: '=children',
          couplePrefetch: '=couple'
        },
        link: function(scope) {
          if (scope.childrenPrefetch == null || (scope.couplePrefetch == null && scope.husbandId && scope.wifeId)) {
            var primaryId, spouseId;
            if (scope.husband && scope.wife) {
              primaryId = scope.husband.id;
              spouseId = scope.wife.id;
            }
            else if (scope.husband) {
              primaryId = scope.husband.id;
              spouseId = null;
            }
            else {
              primaryId = scope.wife.id;
              spouseId = null;
            }
            fsApi.getPersonWithRelationships(primaryId, {persons: true}).then(function(response) {
              if (spouseId) {
                scope.couple = response.getSpouseRelationship(spouseId);
              }
              scope.children = response.getChildrenOf(spouseId);
            });
          }
          else {
            scope.couple = scope.couplePrefetch;
            scope.children = scope.childrenPrefetch;
          }

          scope.showPopover = function(person) {
            return person && person.id !== scope.focusId ? 'true' : '';
          };

        }
      };
    });
})();
