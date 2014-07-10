(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsSourceDescription', function(fsUtils) {
      return {
        templateUrl: 'fsReferenceClientShared/fsSourceDescription/fsSourceDescription.tpl.html',
        scope: {
          description: '='
        },
        link: function(scope) {
          fsUtils.agentSetter(scope);

        }
      };
    });
})();