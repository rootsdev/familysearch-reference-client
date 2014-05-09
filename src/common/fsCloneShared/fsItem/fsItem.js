(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItem', function () {
      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsItem/fsItem.tpl.html',
        scope: {
          item: '=',
          editable: '@',
          deletable: '@',
          remove: '&'
        },
        link: function() {
        }
      };
    });
})();
