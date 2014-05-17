(function(){
  'use strict';
  angular.module('fsClone')
    .config(function ($stateProvider) {
      $stateProvider.state('person', {
        url: '/person/:personId',
        controller: 'PersonController',
        templateUrl: 'person/person.tpl.html',
        data: { pageTitle: 'Person' },
        resolve: {
          person: function($stateParams, fsApi) {
            return fsApi.getPerson($stateParams.personId).then(function (response) {
              return response.getPerson();
            });
          },
          sources: function(_, $q, $stateParams, fsApi) {
            return fsApi.getPersonSourceRefs($stateParams.personId).then(function(response) {
              return _.map(response.getSourceRefs(), function(sourceRef) {
                return {
                  ref: sourceRef,
                  description: response.getSourceDescription(sourceRef.$sourceDescriptionId),
                  id: sourceRef.id
                };
              });
            });
          }
        }
      });
    })
    .controller('PersonController', function ($scope, person, sources, fsUtils) {
      var sections = [
        'lifeSketch',
        'vitalFacts',
        'otherFacts',
        'familyMembers',
        'sources',
        'discussions',
        'notes'
      ];

      $scope.states = {};
      sections.forEach(function(section) {
        $scope.states[section] = {value: section === 'lifeSketch' ? 'closed' : 'open'};
      });

      $scope.person = person;

      $scope.sources = sources;
      sources.forEach(function(source) {
        fsUtils.mixinStateFunctions($scope, source);
      });

    });
})();
