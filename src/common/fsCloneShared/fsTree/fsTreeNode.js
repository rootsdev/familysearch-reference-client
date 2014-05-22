(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsTreeNode', function() {
      return {
        templateUrl: 'fsCloneShared/fsTree/fsTreeNode.tpl.html',
        scope: {
          family: '=',
          expandable: '@'
        },
        controller: function($scope) {
          if ( $scope.family ) {
            console.log('got a family', $scope.family);
            $scope.family.initializationPromise.then(function(){
                console.log('initialiezed family', $scope.family);
            });
          }

          $scope.expandable = false;
          $scope.islive = !!$scope.family;



        }
      };
    });
})();
