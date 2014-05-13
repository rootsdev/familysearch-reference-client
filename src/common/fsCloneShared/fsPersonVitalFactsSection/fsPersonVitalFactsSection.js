(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonVitalFactsSection', function (fsItemHelpers, fsApi, fsVitalFactTypes, fsDeathFactType) {
      return {
        templateUrl: 'fsCloneShared/fsPersonVitalFactsSection/fsPersonVitalFactsSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {
          scope.vitalFactTypes = fsVitalFactTypes;

          scope.vitals = {
            name: scope.person.$getPreferredName() || new fsApi.Name({}),
            gender: scope.person.gender || {}
          };
          fsVitalFactTypes.forEach(function(type) {
            scope.vitals[type] = scope.person.$getFact(type) || new fsApi.Fact({type: type});
          });
          scope.vitals[fsDeathFactType]._living = scope.person.living;

          _.forEach(scope.vitals, function(vital) {
            fsItemHelpers.mixinStateFunctions(scope, vital);
          });
          // override exists function for death to count living as exists
          scope.vitals[fsDeathFactType]._exists = (function() {
            var oldExists = scope.vitals[fsDeathFactType]._exists;
            return function() {
              return oldExists.call(this) || this._living;
            };
          })();

          scope.person.$getSourceRefs().then(function(response) {
            scope.sourceRefs = response.getSourceRefs();
          });

        }
      };
    });
})();
