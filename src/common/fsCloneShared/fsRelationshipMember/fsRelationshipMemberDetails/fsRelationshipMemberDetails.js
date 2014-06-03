(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsRelationshipMemberDetails', function() {
      return {
        templateUrl: 'fsCloneShared/fsRelationshipMember/fsRelationshipMemberDetails/fsRelationshipMemberDetails.tpl.html',
        scope: {
          person: '=',
          role: '@'
        }
      };
    });
})();