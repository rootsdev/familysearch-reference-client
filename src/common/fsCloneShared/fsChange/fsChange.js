(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsChange', function () {
      return {
        templateUrl: 'fsCloneShared/fsChange/fsChange.tpl.html',
        scope: {
          change: '='
        },
        link: function(scope) {
          console.log('change', scope.change);
        }
      };
    });
})();