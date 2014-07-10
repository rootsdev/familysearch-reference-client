(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsItemEdit', function() {

      // emit: save(item), cancel(item)

      return {
        transclude: true,
        templateUrl: 'fsReferenceClientShared/fsItem/fsItemEdit/fsItemEdit.tpl.html',
        scope: {
          item: '=',
          agent: '=',
          hideModified: '@',
          hideButtons: '@'
        }
      };
    });
})();