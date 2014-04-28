(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItemSources', function() {
      return {
        templateUrl: 'fsCloneShared/fsItem/fsItemSources/fsItemSources.tpl.html',
        scope: {
          item: '='
        }
      };
    });
})();