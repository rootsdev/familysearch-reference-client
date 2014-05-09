(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsDiscussionEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsDiscussion/fsDiscussionEdit/fsDiscussionEdit.tpl.html',
        scope: {
          discussion: '=',
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