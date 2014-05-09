(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsCommentEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsComment/fsCommentEdit/fsCommentEdit.tpl.html',
        scope: {
          comment: '=',
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