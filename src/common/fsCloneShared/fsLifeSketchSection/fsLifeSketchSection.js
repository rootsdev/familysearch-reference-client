(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsLifeSketchSection', function () {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsLifeSketchSection/fsLifeSketchSection.tpl.html',
        scope: {
          state: '='
        },
        link: function(scope, elem, attrs) {
        }
      };
    });
})();