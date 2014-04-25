(function(){
  'use strict';
  angular.module('fsClone', [
    'fsClone.person',
    'templates-app',
    'templates-common',
    'ui.router.state',
    'ui.router'
  ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/person');
    })

    .run(function () {
    })

    .controller('AppController', function ($scope) {
    });
})();
