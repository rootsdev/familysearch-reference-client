(function(){
  'use strict';
  angular.module('fsReferenceClient')
    .config(function ($stateProvider) {
      $stateProvider.state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'home/home.tpl.html',
        data: { pageTitle: 'Home' }
      });
    })
    .controller('HomeController', function ($scope, $state, $rootScope, fsApi, fsCurrentUserCache) {
      $scope.signIn = function() {
        fsApi.getAccessToken().then(function() {
          $rootScope.$emit('newSession');
          fsCurrentUserCache.getUser().then(function(user) {
            $state.go('person', { personId: user.personId });
          });
        });
      };

    });
})();
