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
        fsApi.getAccessToken().then(function(response) {
          $state.go('person', { personId: 'KW72-8QQ' });
        });
      };

    });
})();
