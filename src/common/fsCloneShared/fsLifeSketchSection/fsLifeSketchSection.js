(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsLifeSketchSection', function () {
      return {
        templateUrl: 'fsCloneShared/fsLifeSketchSection/fsLifeSketchSection.tpl.html',
        scope: {
          state: '='
        }
      };
    });
})();