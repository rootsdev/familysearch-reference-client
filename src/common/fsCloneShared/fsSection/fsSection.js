(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSection', function () {
      return {
        transclude: true,
        templateUrl: 'fsCloneShared/fsSection/fsSection.tpl.html',
        scope: {
          sectionTitle: '@',
          state: '=',
          detailsOpenable: '@',
          items: '=', // collection of objects with _state property
          addable: '@',
          addLabel: '@',
          add: '&',
          attachable: '@',
          attachLabel: '@',
          attach: '&'
        },
        link: function(scope) {

          // section functions

          scope.toggleState = function() {
            scope.state = scope.state === 'open' ? 'closed' : 'open';
          };

          // item functions

          scope.openDetails = function(open) {
            _.forEach(scope.items, function(item) {
              if (item._state !== 'editing') {
                item._state = open ? 'open' : 'closed';
              }
            });
          };

          scope.hasOpenDetails = function() {
            return _.any(scope.items, function(item) {
              return item._state === 'open';
            });
          };

        }
      };
    });
})();
