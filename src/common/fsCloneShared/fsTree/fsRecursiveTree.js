(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsRecursiveTree', function ($compile) {
      return {
        restrict: 'A',
        scope: {
          family: '=',
          showKids: '@',
          showRootCouple: '@',
          showParents: '@'
        },
        templateUrl: 'fsCloneShared/fsTree/fsRecursiveTree.tpl.html',

        controller: function($scope) {
          // 500 - 60N

//          var nodesInTree = $scope.element.find('div[fs-tree-node]');
//          console.log('the heights', nodesInTree);
//          var size = _.reduce(nodesInTree,function(maxHeight,b){
//            console.log(angular.element(b).height());
//          },0);
//          console.log('size', size);

          $scope.expanded = '';

          $scope.childConnectorBar = function() {
            if ( !$scope.family || !$scope.family.hasChildren() ) {
              return {};
            }
            var nearestEvenNumber = 2 * Math.round($scope.family.children().length/2);

            console.log('the element',$scope.element);
            return {
              top: (388-(nearestEvenNumber-1)*60)+'px'
            };

            //            if ( !$scope.family || !$scope.family.hasChildren() ) {
//              return {};
//            }
//
//            var midpoint = 392;
//            var gapsize = 120;
//            var count = $scope.family.children().length;
//
//            var height = Math.max(gapsize/2,(count-1)*gapsize);
//            var top = Math.min(midpoint-gapsize/2, midpoint - height/2);
//            var result = {
//              height: height+'px',
//              top: top+'px'
//            };
//            console.log(result);
//            return result;
          };

          $scope.childPlacement = function() {
            if ( !$scope.family || !$scope.family.hasChildren() ) {
              return {};
            }
            var nearestEvenNumber = 2 * Math.round($scope.family.children().length/2);
            return {
              top: (500 - nearestEvenNumber*60)+'px'
            };
          };

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


