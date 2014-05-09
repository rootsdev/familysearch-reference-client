(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonVitalFactsSection', function (fsItemHelpers, fsApi, fsVitalFactTypes) {
      return {
        templateUrl: 'fsCloneShared/fsPersonVitalFactsSection/fsPersonVitalFactsSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {
          scope.vitals = {
            name: scope.person.$getPreferredName() || new fsApi.Name({}),
            gender: scope.person.gender || {}
          };
          fsVitalFactTypes.forEach(function(type) {
            scope.vitals[type] = scope.person.$getFact(type) || new fsApi.Fact({type: type});
          });
          scope.vitalFactTypes = fsVitalFactTypes;

          _.forEach(scope.vitals, function(vital) {
            fsItemHelpers.mixinStateFunctions(vital);
          });

        }
      };
    });
})();
