(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsCommentEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsComment/fsCommentEdit/fsCommentEdit.tpl.html',
        scope: {
          item: '=',
          save: '&'
        },
        link: function(scope) {
          scope.submit = function () {
            // TBD
          };
        }
      };
    });
})();