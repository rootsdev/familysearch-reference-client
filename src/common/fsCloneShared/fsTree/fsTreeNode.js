(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsTreeNode', function() {
      return {
        templateUrl: 'fsCloneShared/fsTree/fsTreeNode.tpl.html',
        scope: {
          person: '=',
          spouse: '=',
          expandable: '@'
        },
        controller: function($scope) {
          $scope.expandable = false;
        }
      };
    });
})();
