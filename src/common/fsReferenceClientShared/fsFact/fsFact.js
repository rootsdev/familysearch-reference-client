(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsFact', function(fsUtils, fsDeathFactType) {
      return {
        templateUrl: 'fsReferenceClientShared/fsFact/fsFact.tpl.html',
        scope: {
          person: '=', // needed only if showHistory === 'true'
          fact: '=',
          sources: '=',
          showHistory: '@'
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