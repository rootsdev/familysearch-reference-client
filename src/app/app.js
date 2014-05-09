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

    .run(function () {
    })

    .controller('AppController', function ($scope) {
    });
})();
