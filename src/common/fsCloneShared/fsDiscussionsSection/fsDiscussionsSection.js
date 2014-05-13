(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsDiscussionsSection', function (fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsDiscussionsSection/fsDiscussionsSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {
          scope.discs = [];
          scope.person.$getDiscussionRefs().then(function(response) {
            response.getDiscussionRefs().forEach(function(discussionRef) {
              discussionRef.$getDiscussion().then(function(response) {
                var disc = {
                  ref: discussionRef,
                  discussion: response.getDiscussion(),
                  id: discussionRef.resourceId
                };
                fsItemHelpers.mixinStateFunctions(scope, disc);
                scope.discs.push(disc);
              });
            });
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();