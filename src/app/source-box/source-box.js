(function(){
  'use strict';
  angular.module('fsReferenceClient')
    .config(function ($stateProvider) {
      $stateProvider.state('source-box', {
        url: '/source-box?personId&coupleId&parentsId',
        controller: 'SourceBoxController',
        templateUrl: 'source-box/source-box.tpl.html',
        data: { pageTitle: 'Source Box' }
      });
    })
    .controller('SourceBoxController', function ($scope, $stateParams) {
      $scope.personId = $stateParams.personId;
      $scope.coupleId = $stateParams.coupleId;
      $scope.parentsId = $stateParams.parentsId;
    });
})();