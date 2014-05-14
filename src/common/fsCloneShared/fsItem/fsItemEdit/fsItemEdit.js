(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItemEdit', function() {

      // emit: save(item), cancel(item)

      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsItem/fsItemEdit/fsItemEdit.tpl.html',
        scope: {
          item: '=',
          agent: '=',
          hideModified: '@'
        }
      };
    });
})();