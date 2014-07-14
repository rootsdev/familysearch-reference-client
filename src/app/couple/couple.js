(function(){
  'use strict';
  angular.module('fsReferenceClient')
    .config(function ($stateProvider) {
      $stateProvider.state('couple', {
        url: '/couple/:coupleId',
        controller: 'CoupleController',
        templateUrl: 'couple/couple.tpl.html',
        data: { pageTitle: 'Couple' },
        resolve: {
          couple: function($stateParams, fsApi) {
            return fsApi.getCouple($stateParams.coupleId, {persons: true}).then(function (response) {
              var couple = response.getRelationship();
              return {
                couple: couple,
                husband: response.getPerson(couple.$getHusbandId()),
                wife: response.getPerson(couple.$getWifeId())
              };
            });
          },
          sources: function(_, $q, $stateParams, fsApi) {
            return fsApi.getCoupleSourcesQuery($stateParams.coupleId).then(function(response) {
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
    .controller('CoupleController', function ($scope, $state, $rootScope, couple, sources, fsApi, fsUtils, fsCurrentUserCache) {
      var sections = [
        'couple',
        'coupleEvents',
        'sources',
        'notes'
      ];

      $scope.states = {};
      sections.forEach(function(section) {
        $scope.states[section] = {value: 'open'};
      });

      $scope.couple = couple.couple;
      $scope.husband = couple.husband;
      $scope.wife = couple.wife;

      $scope.sources = sources;
      sources.forEach(function(source) {
        fsUtils.mixinStateFunctions($scope, source);
      });

      var unbindRestored = $rootScope.$on('restored', function() {
        fsApi.getCouple($scope.couple.id, {persons: true}).then(function (response) {
          var couple = response.getRelationship();
          fsUtils.refresh($scope.couple, couple);
          fsUtils.refresh($scope.husband, response.getPerson(couple.$getHusbandId()));
          fsUtils.refresh($scope.wife, response.getPerson(couple.$getWifeId()));
        });
      });
      $scope.$on('$destroy', unbindRestored);

      $scope.$on('delete', function(event, couple, changeMessage) {
        event.stopPropagation();
        couple._busy = true;
        couple.$delete(changeMessage).then(function() {
          couple._busy = false;
          // should we display deleted person here like FS does instead of returning home?
          fsCurrentUserCache.getUser().then(function(user) {
            $state.go('person', { personId: user.personId });
            $rootScope.$emit('alert', {level: 'success', text: 'Couple relationship deleted'});
          });
        });
      });

    });
})();