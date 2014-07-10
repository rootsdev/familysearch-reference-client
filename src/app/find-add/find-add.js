(function(){
  'use strict';
  angular.module('fsReferenceClient')
    .config(function ($stateProvider) {
      $stateProvider.state('find-add', {
        url: '/find-add?husbandId&wifeId&fatherId&motherId&childIds&coupleId&parentsId&returnToPersonId&returnToCoupleId&returnToParentsId',
        controller: 'FindAddController',
        templateUrl: 'find-add/find-add.tpl.html',
        data: { pageTitle: 'Find/Add Person' }
      });
    })
    .controller('FindAddController', function ($scope, $stateParams) {
      $scope.husbandId = $stateParams.husbandId;
      $scope.wifeId = $stateParams.wifeId;
      $scope.fatherId = $stateParams.fatherId;
      $scope.motherId = $stateParams.motherId;
      $scope.childIds = $stateParams.childIds;
      $scope.coupleId = $stateParams.coupleId;
      $scope.parentsId = $stateParams.parentsId;
      $scope.returnToPersonId = $stateParams.returnToPersonId;
      $scope.returnToCoupleId = $stateParams.returnToCoupleId;
      $scope.returnToParentsId = $stateParams.returnToParentsId;
    });
})();