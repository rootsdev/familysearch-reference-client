(function(){
  'use strict';
  angular.module('fsClone')
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
            return fsApi.getCoupleSourceRefs($stateParams.coupleId).then(function(response) {
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
    .controller('CoupleController', function ($scope, couple, sources, fsUtils) {
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

    });
})();