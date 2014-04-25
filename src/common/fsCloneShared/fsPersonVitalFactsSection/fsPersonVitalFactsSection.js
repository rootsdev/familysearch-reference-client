(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonVitalFactsSection', function (_) {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsPersonVitalFactsSection/fsPersonVitalFactsSection.tpl.html',
        scope: {
          state: '='
        },
        link: function(scope, elem, attrs) {
          scope.vitals = {
            name: {state: 'closed', value: {}},
            gender: {state: 'closed', value: {}},
            birth: {state: 'closed', value: {}},
            christening: {state: 'closed', value: null},
            death: {state: 'closed', value: null},
            burial: {state: 'closed', value: null}
          };

          scope.openDetails = function(open) {
            console.log('open details', open);
            _.forEach(scope.vitals, function(vital) {
              if (vital.state !== 'editing') {
                vital.state = open ? 'open' : 'closed';
              }
            });
          };

          scope.hasOpenDetails = function() {
            return _.any(scope.vitals, function(vital) {
              return vital.state === 'open';
            });
          };
        }
      };
    });
})();
