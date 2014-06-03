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
              // Compile the contents
              if(!compiledContents){
                compiledContents = $compile(contents);
              }

              // Re-add the compiled contents to the element
              compiledContents(scope, function(clone){
                element.append(clone);
              });

              // normal "link" functionality would go here.

            }
          };
        }
      };
    });
})();


