(function(){
  'use strict';
  angular.module('fsReferenceClient')
    .config(function ($stateProvider) {
      $stateProvider.state('person', {
        url: '/person/:personId',
        controller: 'PersonController',
        templateUrl: 'person/person.tpl.html',
        data: { pageTitle: 'Person' },
        resolve: {
          person: ['$stateParams','fsApi',function($stateParams, fsApi) {
            return fsApi.getPerson($stateParams.personId).then(function (response) {
              return response.getPerson();
            });
          }],
          sources: ['_','$q','$stateParams','fsApi',function(_, $q, $stateParams, fsApi) {
            return fsApi.getPersonSourcesQuery($stateParams.personId).then(function(response) {
              return _.map(response.getSourceRefs(), function(sourceRef) {
                return {
                  ref: sourceRef,
                  description: response.getSourceDescription(sourceRef.$sourceDescriptionId),
                  id: sourceRef.id
                };
              });
            });
          }]
        }
      });
    })
    .controller('PersonController', function ($scope, $state, $rootScope, person, sources, fsApi, fsUtils, fsCurrentUserCache) {
      var sections = [
        'lifeSketch',
        'vitalFacts',
        'otherInfo',
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
      console.log('person', person);

      $scope.sources = sources;
      sources.forEach(function(source) {
        fsUtils.mixinStateFunctions($scope, source);
      });

      var unbindRestored = $rootScope.$on('restored', function() {
        fsApi.getPerson($scope.person.id).then(function (response) {
          fsUtils.refresh($scope.person, response.getPerson());
        });
      });
      $scope.$on('$destroy', unbindRestored);

      $scope.$on('delete', function(event, person, changeMessage) {
        event.stopPropagation();
        person._busy = true;
        person.$delete(changeMessage).then(function() {
          person._busy = false;
          // should we display deleted person here like FS does instead of returning home?
          fsCurrentUserCache.getUser().then(function(user) {
            $state.go('person', { personId: user.personId });
            $rootScope.$emit('alert', {level: 'success', text: person.$getDisplayName()+' deleted'});
          });
        });
      });

    });
})();
