(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsRecursiveTree', function ($compile) {
      return {
        restrict: 'A',
        scope: {
          family: '=',
          showKids: '=',
          showRootCouple: '=',
          showParents: '='
        },
        templateUrl: 'fsCloneShared/fsTree/fsRecursiveTree.tpl.html',

        controller: function($scope) {
          $scope.childPlacement = function() {
            if ( !$scope.family || !$scope.family.hasChildren() ) {
              return {};
            }
            var nearestEvenNumber = 2 * Math.round($scope.family.children().length/2);
            return {
              top: (500 - nearestEvenNumber*60)+'px'
            };
          };

          $scope.expanded = '';
          $scope.isExpanded = function(s) {
            return s===$scope.expanded;
          };

          $scope.expand = function(s) {
            if ( $scope.expanded === s) {
              $scope.expanded = '';
            } else {
              $scope.expanded = s;
            }
          };

          $scope.childExpanded = '';
          $scope.isChildExpanded = function(s) {
            return s===$scope.childExpanded;
          };

          $scope.expandChild = function(s) {
            if ( $scope.childExpanded===s ) {
              $scope.childExpanded = '';
            } else {
              $scope.childExpanded = s;
            }
          };

          $scope.showExpandAncestor = function(f) {
            var result =  $scope.showParents && !f.isUseless();
            if ( result ) {
              console.log($scope.showParents,f, f.isUseless());
            }
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


