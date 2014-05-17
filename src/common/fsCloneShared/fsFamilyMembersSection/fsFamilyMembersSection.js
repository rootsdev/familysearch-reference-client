(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFamilyMembersSection', function (_, $rootScope, fsApi) {

      function getSpouseFamilies(pwr, self) {
        var families = _.map(pwr.getSpouseRelationships(), function(couple) {
          return {
            husband: pwr.getPerson(couple.$getHusbandId()),
            wife: pwr.getPerson(couple.$getWifeId()),
            relationshipId: couple.id,
            couple: couple,
            children: pwr.getChildrenOf(couple.$getHusbandId() === self.id ? couple.$getWifeId() : couple.$getHusbandId())
          };
        });
        if (pwr.getChildIdsOf(null).length) {
          families.push({
            husband: self._isMale() ? self : null,
            wife: self._isMale() ? null : self,
            children: pwr.getChildrenOf(null)
          });
        }
        return families;
      }

      function getParentFamilies(pwr) {
        return _.map(pwr.getParentRelationships(), function(cap) {
          return {
            husband: cap.$getFatherId() ? pwr.getPerson(cap.$getFatherId()) : null,
            wife: cap.$getMotherId() ? pwr.getPerson(cap.$getMotherId()) : null,
            relationshipId: cap.id
          };
        });
      }

      return {
        templateUrl: 'fsCloneShared/fsFamilyMembersSection/fsFamilyMembersSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {

          fsApi.getPersonWithRelationships(scope.person.id, {persons: true}).then(function(response) {
            scope.spouseFamilies = getSpouseFamilies(response, scope.person);
            scope.parentFamilies = getParentFamilies(response);
          });

          scope.preferredCouple = {};
          fsApi.getPreferredSpouse(scope.person.id).then(function(response) {
            scope.preferredCouple.relationshipId = response;
          });

          scope.preferredParents = {};
          fsApi.getPreferredParents(scope.person.id).then(function(response) {
            scope.preferredParents.relationshipId = response;
          });

          scope.showPreferred = function(family, families) {
            return !!family.relationshipId &&
              _.filter(families, function(family) { return !!family.relationshipId; }).length > 1;
          };

          scope.hideChildren = function(families, hide) {
            _.forEach(families, function(family) {
              family._hideChildren = hide;
            });
          };

          scope.hasHiddenChildren = function(families) {
            return _.any(families, function(family) {
              return family._hideChildren;
            });
          };

          // set/delete preferred spouse/parents
          scope.$on('save', function(event, relationshipId, isSet) {
            event.stopPropagation();
            var isSpouseFamily = _.contains(scope.spouseFamilies, relationshipId);
            var promise;
            if (isSpouseFamily) {
              promise = isSet ? fsApi.setPreferredSpouse(scope.person.id, relationshipId)
                              : fsApi.deletePreferredSpouse(scope.person.id);
            }
            else {
              promise = isSet ? fsApi.setPreferredParents(scope.person.id, relationshipId)
                              : fsApi.deletePreferredParents(scope.person.id);
            }
            promise.then(function() {
              if (isSpouseFamily) {
                scope.preferredCouple.relationshipId = isSet ? relationshipId : null;
              }
              else {
                scope.preferredParents.relationshipId = isSet ? relationshipId : null;
              }
              $rootScope.$emit('saved', relationshipId, isSet);
            });
          });

        }
      };
    });
})();