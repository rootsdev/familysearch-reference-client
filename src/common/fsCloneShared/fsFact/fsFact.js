(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFact', function(fsUtils, fsDeathFactType) {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFact.tpl.html',
        scope: {
          fact: '=',
          sources: '='
        },
        link: function(scope) {
          scope.fact._onOpen(fsUtils.agentSetter(scope));
          scope.fact._onEdit(fsUtils.agentSetter(scope));

          scope.isDeletable = function() {
            return scope.fact.type !== fsDeathFactType;
          };
        }
      };
    });
})();