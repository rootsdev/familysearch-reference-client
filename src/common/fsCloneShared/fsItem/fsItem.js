(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItem', function () {

      // emit: delete(item)

      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsItem/fsItem.tpl.html',
        scope: {
          item: '=',
          editable: '@',
          deletable: '@'
        }
      };
    });
})();
