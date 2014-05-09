(function(){
  'use strict';
  angular.module('fsClone', [
    'fsCloneShared',
    'templates-app',
    'templates-common',
    'ui.bootstrap',
    'ui.router.state',
    'ui.router'
  ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    })

      .config(['fsApiProvider',function(fsApiProvider){
         fsApiProvider.setAppKey('WCQY-7J1Q-GKVV-7DNM-SQ5M-9Q5H-JX3H-CMJK');
         fsApiProvider.setEnvironmentName('sandbox');
         fsApiProvider.setAuthCallback('http://localhost:9000/#!/auth');
      }])

    .run(function () {
    })

    .controller('AppController', function () {
    });
})();
