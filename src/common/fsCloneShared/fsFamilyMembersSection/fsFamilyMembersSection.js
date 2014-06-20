(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFamilyMembersSection', function (_, $rootScope, fsApi, fsUtils) {

      function getSpouseFamilies(pwr, self) {
        // first gather all of the couple relationships
        var families = _.map(pwr.getSpouseRelationships(), function(couple) {
          var spouseId = couple.$getHusbandId() === self.id ? couple.$getWifeId() : couple.$getHusbandId();
          return {
            husband: pwr.getPerson(couple.$getHusbandId()),
            wife: pwr.getPerson(couple.$getWifeId()),
            relationshipId: couple.id,
            couple: couple,
            children: fsUtils.getChildrenWithParentsId(pwr.getChildrenOf(spouseId), pwr.getChildRelationshipsOf(spouseId))
          };
        });
        // next add families with children but no couple relationship
        return families.concat(
          _(pwr.getChildRelationships())
            .map(function(cap) {
              return {
                fatherId: cap.$getFatherId(),
                motherId: cap.$getMotherId()
              };
            })
            .reject(function(parentIds) {
              return !(parentIds.fatherId === self.id || parentIds.motherId === self.id) || // just in case there are other children for some reason?
                _.contains(families, function(family) {
                  return family.husband.id === parentIds.fatherId && family.wife.id === parentIds.motherId;
                });
            })
            .uniq(function(parentIds) {
              return (parentIds.fatherId || '_') + ':' + (parentIds.motherId || '_');
            })
            .map(function(parentIds) {
              var spouseId = (self.id === parentIds.fatherId ? parentIds.motherId : parentIds.fatherId) || null; // ensure undefined becomes null
              return {
                husband: parentIds.fatherId ? pwr.getPerson(parentIds.fatherId) : null,
                wife: parentIds.motherId ? pwr.getPerson(parentIds.motherId) : null,
                children: fsUtils.getChildrenWithParentsId(pwr.getChildrenOf(spouseId), pwr.getChildRelationshipsOf(spouseId))
              };
            })
            .valueOf());
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

          // add new spouse
          scope.addSpouse = function() {
            scope.$emit('navigate', 'find-add', fsUtils.removeEmptyProperties({
              husbandId: scope.person._isMale() ? scope.person.id : null,
              wifeId: !scope.person._isMale() ? scope.person.id : null,
              returnToPersonId: scope.person.id
            }));
          };

          // add child with unknown parent
          scope.addChild = function() {
            scope.$emit('navigate', 'find-add', fsUtils.removeEmptyProperties({
              fatherId: scope.person._isMale() ? scope.person.id : null,
              motherId: !scope.person._isMale() ? scope.person.id : null,
              returnToPersonId: scope.person.id
            }));
          };

          // add parent to child
          scope.addParent = function() {
            scope.$emit('navigate', 'find-add', fsUtils.removeEmptyProperties({
              childIds: scope.person.id,
              returnToPersonId: scope.person.id
            }));
          };

        }
      };
    });
})();