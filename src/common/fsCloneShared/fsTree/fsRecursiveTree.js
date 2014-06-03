(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsRecursiveTree', function () {
      return {
        restrict: 'A',
        scope: {
          family: '=',
          showKids: '@',
          showRootCouple: '@',
          showParents: '@'
        },
        templateUrl: 'fsCloneShared/fsTree/fsRecursiveTree.tpl.html'
      };
    });
})();
