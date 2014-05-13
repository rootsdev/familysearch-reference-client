(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsDiscussionSummary', function() {
      return {
        templateUrl: 'fsCloneShared/fsDiscussion/fsDiscussionSummary/fsDiscussionSummary.tpl.html',
        scope: {
          disc: '='
        }
      };
    });
})();