(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNameDetails', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsName/fsNameDetails/fsNameDetails.tpl.html',
        scope: {
          item: '='
        },
        link: function(scope, elem, attrs) {
        }
      };
    });
})();