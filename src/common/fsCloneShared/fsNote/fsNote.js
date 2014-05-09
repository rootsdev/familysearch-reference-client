(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNote', function(_) {
      return {
        templateUrl: 'fsCloneShared/fsNote/fsNote.tpl.html',
        scope: {
          noteRef: '='
        },
        link: function(scope) {
          scope.note = null;
          scope.agent = null;
          scope.$watch(function() { return scope.noteRef._state; }, function(newValue) {
            if (newValue === 'open' && scope.note === null) {
              scope.noteRef._state = 'closed';

              scope.noteRef.$getNote().then(function(response) {
                scope.note = response.getNote();
                // noteRef maintains the state; bind note._cancelEdit to noteRef
                scope.note._cancelEdit = _.bind(scope.noteRef._cancelEdit, scope.noteRef);

                scope.note.attribution.$getAgent().then(function(response) {
                  scope.agent = response.getAgent();
                  // finally ready to open
                  scope.noteRef._state = 'open';
                });
              });
            }
          });

          scope.save = function () {
            // TBD
          };

          scope.remove = function () {
            // TBD
          };

        }
      };
    });
})();