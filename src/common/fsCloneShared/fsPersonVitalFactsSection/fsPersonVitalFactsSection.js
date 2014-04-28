(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonVitalFactsSection', function (fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsPersonVitalFactsSection/fsPersonVitalFactsSection.tpl.html',
        scope: {
          state: '='
        },
        link: function(scope, elem, attrs) {
          scope.vitals = {
            name: {id: 'foo'},
            gender: {id: 'foo'},
            birth: {id: 'foo', type: 'http://gedcomx.org/Birth'},
            christening: {type: 'http://gedcomx.org/Christening'},
            death: {type: 'http://gedcomx.org/Death'},
            burial: {type: 'http://gedcomx.org/Burial'}
          };

          _.forEach(scope.vitals, function(vital) {
            fsItemHelpers.mixinStateFunctions(vital);
          });

        }
      };
    });
})();
