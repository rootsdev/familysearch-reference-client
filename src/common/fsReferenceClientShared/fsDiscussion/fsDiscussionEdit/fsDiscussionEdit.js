(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsDiscussionEdit', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsDiscussion/fsDiscussionEdit/fsDiscussionEdit.tpl.html',
        scope: {
          disc: '=',
          agent: '='
        },
        link: function(scope) {
          // populate the form from the discussion
          scope.$watch(function() {
            return scope.disc.discussion;
          }, function() {
            scope.form = {
              title: scope.disc.discussion ? scope.disc.discussion.title : '',
              details: scope.disc.discussion ? scope.disc.discussion.details : ''
            };
          }, true);

          // save the form to the note
          scope.$on('save', function(event, disc) {
            event.stopPropagation();
            disc.discussion.title = scope.form.title;
            disc.discussion.details = scope.form.details;
            scope.$parent.$emit('save', disc);
          });

        }
      };
    });
})();