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
            return fsApi.getPerson($stateParams.personId).then(function(response) {
              return response.getPerson();
            });
          }
        }
      });
    })
    .controller('PersonController', function ($scope, person) {
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
        $scope.states[section] = section === 'lifeSketch' ? 'closed' : 'open';
      });

      $scope.person = person;

    });
})();
