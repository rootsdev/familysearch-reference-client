(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceDescription', function(fsUtils) {
      return {
        templateUrl: 'fsCloneShared/fsSourceDescription/fsSourceDescription.tpl.html',
        scope: {
          description: '='
        },
        link: function(scope) {
          fsUtils.agentSetter(scope);

        }
      };
    });
})();