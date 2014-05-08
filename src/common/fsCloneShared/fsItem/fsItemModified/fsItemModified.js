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
          if (scope.item && scope.item.attribution) {
            scope.item.attribution.$getAgent().then(function(response) {
              scope.agent = response.getAgent().$getAccountName();
            });
          }
        }
      };
    });
})();