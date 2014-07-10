(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsItem', function () {

      // emit: delete(item)

      return {
        transclude: true,
        templateUrl: 'fsReferenceClientShared/fsItem/fsItem.tpl.html',
        scope: {
          item: '=',
          editable: '@',
          changeable: '@',
          deletable: '@',
          deleteLabel: '@'
        }
      };
    });
})();
