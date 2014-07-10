(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsGender', function(fsUtils) {
      return {
        templateUrl: 'fsReferenceClientShared/fsGender/fsGender.tpl.html',
        scope: {
          person: '=',
          gender: '=',
          sources: '='
        },
        link: function(scope) {
          scope.gender._onOpen(fsUtils.agentSetter(scope));
          scope.gender._onEdit(fsUtils.agentSetter(scope));

        }
      };
    });
})();
