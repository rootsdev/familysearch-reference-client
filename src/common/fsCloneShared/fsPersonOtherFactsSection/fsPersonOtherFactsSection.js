(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonOtherFactsSection', function (fsItemHelpers, _, fsVitalFactTypes) {
      return {
        templateUrl: 'fsCloneShared/fsPersonOtherFactsSection/fsPersonOtherFactsSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope, elem, attrs) {
          console.log('fsOtherFacts', scope.person.$getFacts());

          scope.names = _.reject(scope.person.$getNames(), function(name) {
            return name.id === (scope.person.$getPreferredName() ? scope.person.$getPreferredName().id : '');
          });
          scope.facts = _.reject(scope.person.$getFacts(), function(fact) {
            return _.contains(fsVitalFactTypes, fact.type) || fact.type === 'http://familysearch.org/v1/LifeSketch';
          });

          _.forEach(scope.facts.concat(scope.names), function(fact) {
            fsItemHelpers.mixinStateFunctions(fact);
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();