(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsCommentsSection', function ($rootScope, fsApi, fsConfirmationModal, fsUtils) {
      return {
        templateUrl: 'fsReferenceClientShared/fsCommentsSection/fsCommentsSection.tpl.html',
        scope: {
          state: '=',
          discussion: '='
        },
        link: function(scope) {
          scope.toggleState = function() {
            scope.state.value = scope.state.value === 'open' ? 'closed' : 'open';
          };

          scope.isOpen = function() {
            return scope.state.value === 'open';
          };

          scope.isAdding = function() {
            return fsUtils.findById(scope.comments, null);
          };

          // read
          function readComments() {
            return scope.discussion.$getComments().then(function(response) {
              scope.comments = response.getComments();
              _.forEach(scope.comments, function (comment) {
                fsUtils.mixinStateFunctions(scope, comment);
              });
              // keep numberOfComments synchronized
              scope.discussion.numberOfComments = scope.comments.length;
            });
          }
          scope.$watch(function() {
            return scope.state.value;
          }, function(newValue) {
            if ((newValue === 'open' || newValue === 'adding') && !scope.comments) {
              scope.state.value = 'loading';
              readComments().then(function() {
                scope.state.value = 'open';
                if (newValue === 'adding') {
                  scope.$emit('add');
                }
              });
            }
            else if (newValue === 'adding') {
              scope.state.value = 'open';
              scope.$emit('add');
            }
          });

          // add
          scope.$on('add', function(event) {
            event.stopPropagation();
            // if not already adding
            if (!scope.isAdding()) {
              var comment = new fsApi.Comment({ $discussionId: scope.discussion.id });
              fsUtils.mixinStateFunctions(scope, comment);
              comment._edit();
              if (!scope.comments) { // the only time this is called without comments set is when there are 0 comments
                scope.state.value = 'open';
                scope.comments = [];
              }
              scope.comments.push(comment);
            }
          });

          // delete
          scope.$on('delete', function(event, comment) {
            event.stopPropagation();
            fsConfirmationModal.open({
              title: 'Delete Comment',
              subTitle: 'Are you sure that you want to delete this comment?',
              okLabel: 'Yes'
            }).then(function() {
              // delete comment
              comment.$delete().then(function() {
                _.remove(scope.comments, {id: comment.id});
                scope.discussion.numberOfComments--; // keep synchronized
                $rootScope.$emit('deleted', comment);
              });
            });
          });

          // save
          scope.$on('save', function(event, comment) {
            event.stopPropagation();
            comment._busy = true;
            comment.$save().then(function() {
              comment._busy = false;
              comment._close();
              $rootScope.$emit('saved', comment);
              readComments(); // can't read just this comment, and it has agent id and creation date that we need for display
            });
          });

          // cancel save
          scope.$on('cancel', function(event, comment) {
            event.stopPropagation();
            if (!!comment.id) {
              comment._open();
            }
            else {
              _.remove(scope.comments, function(comment) { return !comment.id; });
            }
          });

        }
      };
    });
})();