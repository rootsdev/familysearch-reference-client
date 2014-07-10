(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsDiscussionSummary', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsDiscussion/fsDiscussionSummary/fsDiscussionSummary.tpl.html',
        scope: {
          disc: '='
        }
      };
    });
})();