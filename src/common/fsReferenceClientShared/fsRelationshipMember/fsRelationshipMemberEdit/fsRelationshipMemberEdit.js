(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsRelationshipMemberEdit', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsRelationshipMember/fsRelationshipMemberEdit/fsRelationshipMemberEdit.tpl.html',
        scope: {
          person: '=',
          agent: '=',
          role: '@'
        }
      };
    });
})();