(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItemSources', function(_, $q, fsApi, fsUtils) {
      return {
        templateUrl: 'fsCloneShared/fsItem/fsItemSources/fsItemSources.tpl.html',
        scope: {
          item: '=',
          sources: '='
        },
        link: function(scope) {
          var tag = fsUtils.getItemTag(scope.item);

          scope.getSources = function() {
            return _.filter(scope.sources, function(source) {
              return _.contains(source.ref.$getTags(), tag);
            });
          };

        }
      };
    });
})();