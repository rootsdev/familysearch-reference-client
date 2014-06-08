(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsTreeNode', function($state) {
      return {
        templateUrl: 'fsCloneShared/fsTree/fsTreeNode.tpl.html',
        scope: {
          family: '=',
          expandable: '=',
          brackets: '@'
        },
        link: function($scope) {
          $scope.islive = !!$scope.family;

          function createFindAddContext() {
            var family = $scope.family;

            var invocationContext = {
              wifeId: null,
              motherId: null,
              husbandId: null,
              fatherId: null,
              childIds: null,
              returnToPersonId: null
            };

            if ( family.hasWife() ) {
              invocationContext.wifeId = family.wifeDescription.person.id;
              invocationContext.motherId = family.wifeDescription.person.id;
            }
            if ( family.hasHusband() ) {
              invocationContext.husbandId = family.husbandDescription.person.id;
              invocationContext.fatherId = family.husbandDescription.person.id;
            }
            if ( family.hasChildren() ) {
              invocationContext.childIds = _.map(family.children(),'id');
            } else {
              if ( family.referenceId ) {
                invocationContext.childIds = [family.referenceId];
              }
            }
            if ( family.referenceId ) {
              invocationContext.returnToPersonId = family.referenceId;
            }
            else
            if ( family.hasHusband() ) {
              invocationContext.returnToPersonId = family.husbandDescription.person.id;
            }
            else
            if ( family.hasWife() ) {
              invocationContext.returnToPersonId = family.wifeDescription.person.id;
            }
            if ( invocationContext.childIds ) {
              invocationContext.childIds = invocationContext.childIds.join(',');
            }
            return invocationContext;
          }

          $scope.navigateToFindAdd = function() {
            $state.go('find-add', createFindAddContext());
          };



        }
      };
    });
})();
