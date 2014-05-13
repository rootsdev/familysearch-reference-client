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
          scope.setAgent = function() {
            if (!scope.agent) {
              scope.change.$getAgent().then(function(response) {
                scope.agent = response.getAgent();
              });
            }
          };
        }
      };
    });
})();