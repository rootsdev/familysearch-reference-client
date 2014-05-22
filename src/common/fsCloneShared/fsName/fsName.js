(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsName', function(fsUtils) {
      return {
        templateUrl: 'fsCloneShared/fsName/fsName.tpl.html',
        scope: {
          person: '=',
          name: '=',
          sources: '='
        },
        link: function(scope) {
          scope.name._onOpen(fsUtils.agentSetter(scope));
          scope.name._onEdit(fsUtils.agentSetter(scope));

        }
      };
    });
})();
