(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsTreeFragment', function ($compile) {
      return {
        restrict: 'A',
        scope: {
          family: '=',
          showKids: '=',
          showRootCouple: '=',
          showParents: '='
        },
        templateUrl: 'fsReferenceClientShared/fsTree/fsTreeFragment.tpl.html',

        controller: function($scope) {
          $scope.childFamiliesPlacement = function() {
            if ( !$scope.family || !$scope.family.hasChildFamilies() ) {
              return {};
            }
            var nearestEvenNumber = 2 * Math.round($scope.family.childFamilies().length/2);
            return {
              top: (500 - nearestEvenNumber*60)+'px'
            };
          };

          $scope.expanded = '';
          $scope.isExpanded = function(s) {
            return s===$scope.expanded;
          };

          $scope.expand = function(s, family) {
            if ( $scope.expanded === s) {
              $scope.expanded = '';
            } else {
              $scope.expanded = s;
              if ( family ) {
                family.initAncestry();
              }
            }
          };

          $scope.childExpanded = '';
          $scope.isChildExpanded = function(s) {
            return s===$scope.childExpanded;
          };

          $scope.expandChild = function(s, family) {
            if ( $scope.childExpanded===s ) {
              $scope.childExpanded = '';
            } else {
              $scope.childExpanded = s;
              if ( family ) {
                family.initDescendancy();
              }
            }
          };

          $scope.showExpandAncestor = function(f) {
            var result =  $scope.showParents && f && !f.isUseless();
            return result;
          };


        },
        compile: function(element){
          // Break the recursion loop by removing the contents
          var contents = element.contents().remove();
          var compiledContents;

          return {
            pre: null,

            post: function(scope, element){
              scope.element = element;

              // Compile the contents
              if(!compiledContents){
                compiledContents = $compile(contents);
              }

              // Re-add the compiled contents to the element
              compiledContents(scope, function(clone){
                element.append(clone);
              });

              scope.element = angular.element(element);


            }
          };
        }
      };
    });
})();


