(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsSourceAttachmentsSection', function(fsUtils) {
      return {
        templateUrl: 'fsReferenceClientShared/fsSourceAttachmentsSection/fsSourceAttachmentsSection.tpl.html',
        scope: {
          description: '=',
          max: '@'
        },
        link: function(scope) {
          fsUtils.getSourceRefContexts(scope.description, false, scope.max || 0).then(function(response) {
            scope.sourceRefContexts = response;
          });

        }
      };
    });
})();