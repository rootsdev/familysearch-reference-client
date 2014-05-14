(function(){
  'use strict';
  angular.module('fsClone')
    .config(function ($stateProvider) {
      $stateProvider.state('tree', {
        url: '/tree/:personId',
        controller: 'TreeController',
        templateUrl: 'tree/tree.tpl.html',
        data: { pageTitle: 'Tree' },
        resolve: {
          person: function($stateParams, fsApi) {
            return fsApi.getPerson($stateParams.personId).then(function(response) {
              return response.getPerson();
            });
          }
        }
      });
    })
    .controller('TreeController', function ($scope, person) {
      $scope.person = person;

    });
})();
