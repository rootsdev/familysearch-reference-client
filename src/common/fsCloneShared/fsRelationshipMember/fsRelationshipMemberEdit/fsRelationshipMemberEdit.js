(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsRelationshipMemberEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsRelationshipMember/fsRelationshipMemberEdit/fsRelationshipMemberEdit.tpl.html',
        scope: {
          person: '=',
          agent: '=',
          role: '@'
        }
      };
    });
})();