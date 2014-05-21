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
          $scope.expandable = false;
          $scope.islive = !!$scope.family;
        }
      };
    });
})();
