(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFamilyMembersSection', function (_, fsApi) {

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
          scope.preferredCouple = {};
          scope.preferredParents = {};

          fsApi.getPersonWithRelationships(scope.person.id, {persons: true}).then(function(response) {
            scope.spouseFamilies = getSpouseFamilies(response, scope.person);
            console.log('spouseFamilies', scope.spouseFamilies);
            scope.parentFamilies = getParentFamilies(response);
            console.log('parentFamilies', scope.parentFamilies);
          });
          fsApi.getPreferredSpouse(scope.person.id).then(function(response) {
            scope.preferredCouple.relationshipId = response;
            console.log('preferredCouple', response);
          });
          fsApi.getPreferredParents(scope.person.id).then(function(response) {
            scope.preferredParents.relationshipId = response;
            console.log('preferredParents', response);
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



        }
      };
    });
})();