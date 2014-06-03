(function(){
  'use strict';
  angular.module('fsClone')
    .config(function ($stateProvider) {
      $stateProvider.state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'home/home.tpl.html',
        data: { pageTitle: 'Home' }
      });
    })
    .controller('HomeController', function ($scope, $state, fsApi) {
      $scope.signIn = function() {
        fsApi.getAccessToken().then(function() {
          fsApi.getCurrentUser().then(function(response) {
            var user = response.getUser();
            $state.go('person', { personId: user.personId });
          });
        });
      };

    });
})();
