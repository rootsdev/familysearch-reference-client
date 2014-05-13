(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFamilyMembers', function (fsApi) {
      return {
        templateUrl: 'fsCloneShared/fsFamilyMembers/fsFamilyMembers.tpl.html',
        scope: {
          family: '=', // {husband, wife, relationshipId, children (optional), couple (optional)}
          focusId: '=',
          showPreferred: '@',
          preferred: '=' // {relationshipId}
        },
        link: function(scope) {
          if (scope.family.children == null || (scope.family.couple == null && !!scope.family.husband && !!scope.family.wife)) {
            var primaryId, spouseId;
            if (scope.family.husband && scope.family.wife) {
              primaryId = scope.family.husband.id;
              spouseId = scope.family.wife.id;
            }
            else if (scope.family.husband) {
              primaryId = scope.family.husband.id;
              spouseId = null;
            }
            else {
              primaryId = scope.family.wife.id;
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
            scope.couple = scope.family.couple;
            scope.children = scope.family.children;
          }

          scope.toggleHideChildren = function() {
            scope.family._hideChildren = scope.family._hideChildren ? false : true;
          };

          scope.showPopover = function(person) {
            return person && person.id !== scope.focusId ? 'true' : '';
          };

          scope.$watch(function() { return scope.preferred.relationshipId; }, function() {
            scope.isPreferred = !!scope.family.relationshipId && scope.family.relationshipId === scope.preferred.relationshipId;
          });

          scope.changePreferred = function() {
            scope.preferred.relationshipId = scope.family.relationshipId;
          };

        }
      };
    });
})();
