(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsDiscussionContributor', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsDiscussion/fsDiscussionContributor/fsDiscussionContributor.tpl.html',
        scope: {
          disc: '=',
          agent: '='
        }
      };
    });
})();