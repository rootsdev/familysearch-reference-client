(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsItemReason', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsItem/fsItemReason/fsItemReason.tpl.html',
        scope: {
          item: '='
        }
      };
    });
})();