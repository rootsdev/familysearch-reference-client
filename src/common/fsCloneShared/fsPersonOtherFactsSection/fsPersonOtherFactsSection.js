(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonOtherFactsSection', function (fsItemHelpers, _, fsApi, fsVitalFactTypes) {
      return {
        templateUrl: 'fsCloneShared/fsPersonOtherFactsSection/fsPersonOtherFactsSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope, elem, attrs) {
          scope.names = _.reject(scope.person.$getNames(), function(name) {
            return name.id === (scope.person.$getPreferredName() ? scope.person.$getPreferredName().id : '');
          });
          scope.facts = _.reject(scope.person.$getFacts(), function(fact) {
            return _.contains(fsVitalFactTypes, fact.type) || fact.type === 'http://familysearch.org/v1/LifeSketch';
          });
          scope.allItems = scope.names.concat(scope.facts);

          _.forEach(scope.allItems, function(item) {
            fsItemHelpers.mixinStateFunctions(item);
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();