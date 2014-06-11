(function () {
  'use strict';
  angular.module('fsClone', [
    'fsCloneShared',
    'templates-app',
    'templates-common',
    'ui.bootstrap',
    'ui.router.state',
    'ui.router'
  ])
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    })

    .config(function(fsApiProvider) {
      fsApiProvider
        .setAppKey('WCQY-7J1Q-GKVV-7DNM-SQ5M-9Q5H-JX3H-CMJK')
        .setEnvironmentName('sandbox')
        .setAuthCallback('http://localhost:9000/#!/auth');
        //.setEnvironmentName('beta')
        //.setAuthCallback('http://demo.werelate.org/#/auth');
    })

    .run(function () {
    })

    .controller('AppController', function ($scope, $rootScope, $state) {
      $scope.environment = 'Sandbox';
      //$scope.environment = 'Beta';

      // handle navigation events from fsCloneShared components
      $rootScope.$on('navigate', function(event, route, params) {
        event.stopPropagation();
        $state.go(route, params);
      });
    });

    // don't forget to edit index.html to add {Track:js} script on demo

})();
