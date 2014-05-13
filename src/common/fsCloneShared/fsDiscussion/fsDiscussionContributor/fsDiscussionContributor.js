(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsDiscussionContributor', function() {
      return {
        templateUrl: 'fsCloneShared/fsDiscussion/fsDiscussionContributor/fsDiscussionContributor.tpl.html',
        scope: {
          disc: '=',
          agent: '='
        }
      };
    });
})();