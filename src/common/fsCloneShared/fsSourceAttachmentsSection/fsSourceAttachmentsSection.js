(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceAttachmentsSection', function(fsSourceUtils) {
      return {
        templateUrl: 'fsCloneShared/fsSourceAttachmentsSection/fsSourceAttachmentsSection.tpl.html',
        scope: {
          description: '=',
          max: '@'
        },
        link: function(scope) {
          fsSourceUtils.getSourceRefs(scope.description, false, scope.max || 0).then(function(response) {
            scope.sourceRefs = response;
          });

        }
      };
    });
})();