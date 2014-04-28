(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItemReason', function() {
      return {
        templateUrl: 'fsCloneShared/fsItem/fsItemReason/fsItemReason.tpl.html',
        scope: {
          item: '='
        }
      };
    });
})();