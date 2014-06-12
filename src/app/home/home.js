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
    .controller('HomeController', function ($scope, $state, $rootScope, fsApi, fsUserCache) {
      $scope.signIn = function() {
        fsApi.getAccessToken().then(function() {
          fsUserCache.getUser().then(function(user) {
            $state.go('person', { personId: user.personId });
          });
        });
      };

    });
})();
