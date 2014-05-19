(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsOtherInfoSection', function (fsUtils, _, fsApi, fsVitalFactTypes) {
      return {
        templateUrl: 'fsCloneShared/fsOtherInfoSection/fsOtherInfoSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {
          scope.names = _.reject(scope.person.$getNames(), function(name) {
            return name.id === (scope.person.$getPreferredName() ? scope.person.$getPreferredName().id : '');
          });
          scope.facts = _.reject(scope.person.$getFacts(), function(fact) {
            return _.contains(fsVitalFactTypes, fact.type) || fact.type === 'http://familysearch.org/v1/LifeSketch';
          });
          scope.allItems = scope.names.concat(scope.facts);

          _.forEach(scope.allItems, function(item) {
            fsUtils.mixinStateFunctions(scope, item);
          });

          scope.add = function() {
            // TBD
          };

        }
      };
    });
})();