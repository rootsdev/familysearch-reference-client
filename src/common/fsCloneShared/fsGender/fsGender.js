(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGender', function(fsUtils) {
      return {
        templateUrl: 'fsCloneShared/fsGender/fsGender.tpl.html',
        scope: {
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
