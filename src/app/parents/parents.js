(function(){
  'use strict';
  angular.module('fsReferenceClient')
    .config(function ($stateProvider) {
      $stateProvider.state('parents', {
        url: '/parents/:parentsId',
        controller: 'ParentsController',
        templateUrl: 'parents/parents.tpl.html',
        data: { pageTitle: 'Parents' },
        resolve: {
          parents: function($stateParams, fsApi) {
            return fsApi.getChildAndParents($stateParams.parentsId, {persons: true}).then(function (response) {
              var parents = response.getRelationship();
              return {
                parents: parents,
                father: !!parents.$getFatherId() ? response.getPerson(parents.$getFatherId()) : null,
                mother: !!parents.$getMotherId() ? response.getPerson(parents.$getMotherId()) : null,
                child: response.getPerson(parents.$getChildId())
              };
            });
          },
          sources: function(_, $q, $stateParams, fsApi) {
            return fsApi.getChildAndParentsSourcesQuery($stateParams.parentsId).then(function(response) {
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
    .controller('ParentsController', function ($scope, $state, $rootScope, parents, sources, fsApi, fsUtils, fsCurrentUserCache) {
      var sections = [
        'parents',
        'sources',
        'notes'
      ];

      $scope.states = {};
      sections.forEach(function(section) {
        $scope.states[section] = {value: 'open'};
      });

      $scope.parents = parents.parents;
      $scope.father = parents.father;
      $scope.mother = parents.mother;
      $scope.child = parents.child;

      $scope.sources = sources;
      sources.forEach(function(source) {
        fsUtils.mixinStateFunctions($scope, source);
      });

      var unbindRestored = $rootScope.$on('restored', function() {
        fsApi.getChildAndParents($scope.parents.id, {persons: true}).then(function (response) {
          var parents = response.getRelationship();
          fsUtils.refresh($scope.parents, parents);
          fsUtils.refresh($scope.child, response.getPerson(parents.$getChildId()));
          if (!!$scope.father && !!parents.$getFatherId()) {
            fsUtils.refresh($scope.father, response.getPerson(parents.$getFatherId()));
          }
          else {
            $scope.father = !!parents.$getFatherId() ? response.getPerson(parents.$getFatherId()) : null;
          }
          if (!!$scope.mother && !!parents.$getMotherId()) {
            fsUtils.refresh($scope.mother, response.getPerson(parents.$getMotherId()));
          }
          else {
            $scope.mother = !!parents.$getMotherId() ? response.getPerson(parents.$getMotherId()) : null;
          }
        });
      });
      $scope.$on('$destroy', unbindRestored);

      $scope.$on('delete', function(event, parents, changeMessage) {
        event.stopPropagation();
        parents._busy = true;
        parents.$delete(changeMessage).then(function() {
          parents._busy = false;
          // should we display deleted person here like FS does instead of returning home?
          fsCurrentUserCache.getUser().then(function(user) {
            $state.go('person', { personId: user.personId });
            $rootScope.$emit('alert', {level: 'success', text: 'Child-and-parents relationship deleted'});
          });
        });
      });

    });
})();