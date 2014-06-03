(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsRelationshipMember', function(fsUtils) {
      return {
        templateUrl: 'fsCloneShared/fsRelationshipMember/fsRelationshipMember.tpl.html',
        scope: {
          person: '=',
          role: '@'
        },
        link: function(scope) {
          scope.person._onOpen(fsUtils.agentSetter(scope));
        }
      };
    });
})();