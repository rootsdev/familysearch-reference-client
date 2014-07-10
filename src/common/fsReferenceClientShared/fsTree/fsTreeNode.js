(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsTreeNode', function(fsLocation) {
      return {
        templateUrl: 'fsReferenceClientShared/fsTree/fsTreeNode.tpl.html',
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
              invocationContext.wifeId = family.getWife().id;
              invocationContext.motherId = family.getWife().id;
            }
            if ( family.hasHusband() ) {
              invocationContext.husbandId = family.getHusband().id;
              invocationContext.fatherId = family.getHusband().id;
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
              invocationContext.returnToPersonId = family.getHusband().id;
            }
            else
            if ( family.hasWife() ) {
              invocationContext.returnToPersonId = family.getWife().id;
            }
            if ( invocationContext.childIds ) {
              invocationContext.childIds = invocationContext.childIds.join(',');
            }
            return invocationContext;
          }

          $scope.$watch(function() {
            return $scope.family;
          }, function() {
            if (!!$scope.family) {
              $scope.findAddHref = fsLocation.getFindAddUrl(createFindAddContext());
              if ( $scope.family.getHusband() ) {
                $scope.treeWithUnknownMotherHref = fsLocation.getTreeUrl($scope.family.getHusband().id,{spouseId:'unknown'});
              }
              if ( $scope.family.getWife() ) {
                $scope.treeWithUnknownFatherHref = fsLocation.getTreeUrl($scope.family.getWife().id,{spouseId:'unknown'});
              }
            }
          });

          $scope.initHoverData = function() {
            if ( !$scope.didInitHoverData && $scope.family ) {
              $scope.didInitHoverData = true;
              $scope.family.initHoverData();
            }
          };

          $scope.lifespanText = function(person) {
            if ( person && person.id && person.$getDisplayLifeSpan ) {
              return person.$getDisplayLifeSpan();
            }
            return '';
          };



        }
      };
    });
})();
