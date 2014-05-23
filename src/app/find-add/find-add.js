(function(){
  'use strict';
  angular.module('fsClone')
    .config(function ($stateProvider) {
      $stateProvider.state('find-add', {
        url: '/find-add?husbandId&wifeId&fatherId&motherId&childId&returnToId',
        controller: 'FindAddController',
        templateUrl: 'find-add/find-add.tpl.html',
        data: { pageTitle: 'Find/Add Person' }
      });
    })
    .controller('FindAddController', function ($scope, $stateParams) {
      console.log('$stateParams', $stateParams);
    });
})();