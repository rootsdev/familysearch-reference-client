(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsRelationshipMember', function(fsUtils) {
      return {
        templateUrl: 'fsReferenceClientShared/fsRelationshipMember/fsRelationshipMember.tpl.html',
        scope: {
          person: '=',
          role: '@',
          changeable: '@',
          deletable: '@'
        },
        link: function(scope) {
          scope.person._onOpen(fsUtils.agentSetter(scope));
        }
      };
    });
})();