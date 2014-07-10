(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsLifeSketchSection', function () {
      return {
        templateUrl: 'fsReferenceClientShared/fsLifeSketchSection/fsLifeSketchSection.tpl.html',
        scope: {
          state: '='
        }
      };
    });
})();