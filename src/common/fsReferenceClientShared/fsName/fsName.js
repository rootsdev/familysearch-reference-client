(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsName', function(fsUtils) {
      return {
        templateUrl: 'fsReferenceClientShared/fsName/fsName.tpl.html',
        scope: {
          person: '=',
          name: '=',
          sources: '='
        },
        link: function(scope) {
          scope.name._onOpen(fsUtils.agentSetter(scope));
          scope.name._onEdit(fsUtils.agentSetter(scope));

          scope.isDeletable = function() {
            return !scope.name.preferred;
          };
        }
      };
    });
})();
