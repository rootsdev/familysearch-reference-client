(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceAttachmentsSection', function(fsUtils) {
      return {
        templateUrl: 'fsCloneShared/fsSourceAttachmentsSection/fsSourceAttachmentsSection.tpl.html',
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