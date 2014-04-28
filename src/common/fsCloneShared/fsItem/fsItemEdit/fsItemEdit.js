(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItemEdit', function() {
      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsItem/fsItemEdit/fsItemEdit.tpl.html',
        scope: {
          item: '=',
          submit: '&'
        }
      };
    });
})();