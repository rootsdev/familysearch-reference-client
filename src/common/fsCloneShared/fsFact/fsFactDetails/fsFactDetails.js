(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactDetails', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsFact/fsFactDetails/fsFactDetails.tpl.html',
        scope: {
          item: '=',
          type: '@'
        },
        link: function(scope, elem, attrs) {
        }
      };
    });
})();
