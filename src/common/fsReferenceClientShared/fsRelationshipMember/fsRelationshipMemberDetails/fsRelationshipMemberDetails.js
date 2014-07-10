(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsRelationshipMemberDetails', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsRelationshipMember/fsRelationshipMemberDetails/fsRelationshipMemberDetails.tpl.html',
        scope: {
          person: '=',
          agent: '='
        }
      };
    });
})();