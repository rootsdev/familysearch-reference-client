(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsRelationshipMemberSummary', function() {
      return {
        templateUrl: 'fsCloneShared/fsRelationshipMember/fsRelationshipMemberSummary/fsRelationshipMemberSummary.tpl.html',
        scope: {
          person: '=',
          role: '@'
        }
      };
    });
})();