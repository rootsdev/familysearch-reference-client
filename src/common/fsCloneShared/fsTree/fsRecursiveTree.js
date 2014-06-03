(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsRecursiveTree', function (RecursionHelper) {
      return {
        restrict: 'A',
        scope: {
          family: '=',
          showKids: '@',
          showRootCouple: '@',
          showParents: '@'
        },
        templateUrl: 'fsCloneShared/fsTree/fsRecursiveTree.tpl.html',
        compile: function(element) {
          var doRecursion = element.attr('recurse');

          return RecursionHelper.compile(element, function (scope, iElement, iAttrs, controller, transcludeFn) {
            // Define your normal link function here.
            // Alternative: instead of passing a function,
            // you can also pass an object with
            // a 'pre'- and 'post'-link function.
            console.log(transcludeFn);
          },  doRecursion);
        }
      };
    });
})();


