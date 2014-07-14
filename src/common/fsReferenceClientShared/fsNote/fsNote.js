(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsNote', function(fsUtils) {
      return {
        templateUrl: 'fsReferenceClientShared/fsNote/fsNote.tpl.html',
        scope: {
          note: '='
        },
        link: function(scope) {
          scope.note._onOpen(fsUtils.agentSetter(scope));
          scope.note._onEdit(fsUtils.agentSetter(scope));
        }
      };
    });
})();