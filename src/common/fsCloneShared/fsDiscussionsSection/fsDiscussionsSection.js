(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsDiscussionsSection', function ($q, $rootScope, fsItemHelpers, fsApi, fsConfirmationModal) {
      return {
        templateUrl: 'fsCloneShared/fsDiscussionsSection/fsDiscussionsSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {
          // read
          scope.discs = [];
          if (!scope.person.living) {
            scope.person.$getDiscussionRefs().then(function(response) {
              response.getDiscussionRefs().forEach(function(discussionRef) {
                discussionRef.$getDiscussion().then(function(response) {
                  var disc = {
                    ref: discussionRef,
                    discussion: response.getDiscussion(),
                    id: discussionRef.resourceId // so ._exists() and findById() work
                  };
                  fsItemHelpers.mixinStateFunctions(scope, disc);
                  scope.discs.push(disc);
                });
              });
            });
          }

          // add
          scope.$on('add', function() {
            // if not already adding
            if (!fsItemHelpers.findById(scope.discs, null)) {
              var disc = {
                ref: new fsApi.DiscussionRef({ $personId: scope.person.id }),
                discussion: new fsApi.Discussion(),
                id: null
              };
              fsItemHelpers.mixinStateFunctions(scope, disc);
              disc._edit();
              scope.discs.unshift(disc);
            }
          });

          // delete
          scope.$on('delete', function(event, disc) {
            fsConfirmationModal.open({
              title: 'Delete Discussion',
              subTitle: 'Are you sure that you want to delete this discussion and all of its comments?',
              okLabel: 'Yes'
            }).then(function() {
              // delete discussion ref and discussion
              // TODO put this back when FS bug is fixed
//              disc._busy = true;
//              $q.all([disc.ref.$delete(), disc.discussion.$delete()]).then(function() {
//                _.remove(scope.discs, {id: disc.id});
//                $rootScope.$emit('deleted', disc);
//              });
            });
          });

          // save
          scope.$on('save', function(event, disc) {
            disc._busy = true;
            disc.discussion.$save(null, true).then(function() {
              // save discussion ref if new
              (disc.ref.resourceId ? $q.when(null) : disc.ref.$setDiscussion(disc.discussion).$save()).then(function() {
                disc.id = disc.ref.resourceId; // so ._exists() and findById() work
                disc._busy = false;
                disc._open();
                $rootScope.$emit('saved', disc);
              });
            });
          });

          // cancel save
          scope.$on('cancel', function(event, disc) {
            if (!!disc.id) {
              disc._open();
            }
            else {
              _.remove(scope.discs, function(disc) { return !disc.id; });
            }
          });

        }
      };
    });
})();