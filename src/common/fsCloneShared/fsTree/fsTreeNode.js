(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsTreeNode', function($state) {
      return {
        templateUrl: 'fsCloneShared/fsTree/fsTreeNode.tpl.html',
        scope: {
          family: '=',
          expandable: '@'
        },
        link: function($scope) {
          $scope.expandable = false;
          $scope.islive = !!$scope.family;

          function createFindAddContext() {
            var family = $scope.family;

            var invocationContext = {
              wifeId: null,
              motherId: null,
              husbandId: null,
              fatherId: null,
              childIds: null,
              returnToId: null
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
              invocationContext.returnToId = family.referenceId;
            }
            else
            if ( family.hasHusband() ) {
              invocationContext.returnToId = family.husbandDescription.person.id;
            }
            else
            if ( family.hasWife() ) {
              invocationContext.returnToId = family.wifeDescription.person.id;
            }
            if ( invocationContext.childIds ) {
              invocationContext.childIds = invocationContext.childIds.join(',');
            }
            return invocationContext;
          }

          $scope.navigateToFindAdd = function() {
            console.log('reference is', $scope.family.referenceId);
            $state.go('find-add', createFindAddContext());
          };




        }
      };
    });
})();
