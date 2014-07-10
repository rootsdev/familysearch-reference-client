(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsRelationshipMemberSummary', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsRelationshipMember/fsRelationshipMemberSummary/fsRelationshipMemberSummary.tpl.html',
        scope: {
          person: '=',
          role: '@'
        }
      };
    });
})();