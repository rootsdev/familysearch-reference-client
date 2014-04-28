(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonOtherFactsSection', function (fsItemHelpers) {
      return {
        templateUrl: 'fsCloneShared/fsPersonOtherFactsSection/fsPersonOtherFactsSection.tpl.html',
        scope: {
          state: '='
        },
        link: function(scope, elem, attrs) {
          scope.facts = [
            {id: 'foo', type: 'http://gedcomx.org/Residence'},
            {id: 'foo', type: 'http://gedcomx.org/Naturalization'}
          ];

          _.forEach(scope.facts, function(fact) {
            fsItemHelpers.mixinStateFunctions(fact);
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();