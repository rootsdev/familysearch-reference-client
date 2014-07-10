(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsCommentEdit', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsComment/fsCommentEdit/fsCommentEdit.tpl.html',
        scope: {
          comment: '='
        },
        link: function (scope) {
          // populate the form from the comment
          scope.$watch(function () {
            return scope.comment;
          }, function () {
            scope.form = {
              text: scope.comment.text
            };
          }, true);

          // save the form to the comment
          scope.$on('save', function (event, comment) {
            event.stopPropagation();
            comment.text = scope.form.text;
            scope.$parent.$emit('save', comment);
          });

        }
      };
    });
})();