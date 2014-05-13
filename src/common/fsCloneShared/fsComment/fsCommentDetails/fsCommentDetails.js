(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsCommentDetails', function() {
      return {
        templateUrl: 'fsCloneShared/fsComment/fsCommentDetails/fsCommentDetails.tpl.html',
        scope: {
          comment: '='
        },
        link: function(scope) {
          scope.comment.$getAgent().then(function(response) {
            scope.agent = response.getAgent();
          });
        }
      };
    });
})();