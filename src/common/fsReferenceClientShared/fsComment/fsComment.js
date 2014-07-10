(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsComment', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsComment/fsComment.tpl.html',
        scope: {
          comment: '='
        }
      };
    });
})();