(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceDetails', function() {
      return {
        templateUrl: 'fsCloneShared/fsSource/fsSourceDetails/fsSourceDetails.tpl.html',
        scope: {
          source: '='
        },
        link: function(scope) {
          scope.source._onOpen(function(source) {
            if (source.ref.attribution && !scope.agent) {
              return source.ref.attribution.$getAgent().then(function (response) {
                scope.agent = response.getAgent();
              });
            }
            return null;
          });

          scope.save = function () {
            // TBD
          };

          scope.remove = function () {
            // TBD
          };

        }
      };
    });
})();