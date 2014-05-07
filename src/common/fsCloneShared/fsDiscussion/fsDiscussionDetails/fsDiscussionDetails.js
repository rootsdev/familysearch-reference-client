(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsDiscussionDetails', function() {
      return {
        templateUrl: 'fsCloneShared/fsDiscussion/fsDiscussionDetails/fsDiscussionDetails.tpl.html',
        scope: {
          item: '='
        }
      };
    });
})();