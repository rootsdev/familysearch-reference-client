(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsLifeSketch', function () {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsLifeSketch/fsLifeSketch.tpl.html'
      };
    });
})();