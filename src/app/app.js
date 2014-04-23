angular.module('fsTree', [
    'fsTree.home',
    'fsTree.about',
    'templates-app',
    'templates-common',
    'ui.router.state',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
  })

  .run(function () {})

  .controller('AppController', function ($scope) {
  });
