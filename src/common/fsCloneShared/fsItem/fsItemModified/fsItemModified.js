(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItemModified', function() {
      return {
        templateUrl: 'fsCloneShared/fsItem/fsItemModified/fsItemModified.tpl.html',
        scope: {
          item: '=',
          showHistory: '@'
        },
        link: function(scope, elem, attrs) {
          console.log('showHistory', scope.showHistory);
        }
      };
    });
})();