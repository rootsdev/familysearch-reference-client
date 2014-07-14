(function () {
  'use strict';
  angular.module('fsReferenceClient', [
    'fsReferenceClientShared',
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
        .setClientId('WCQY-7J1Q-GKVV-7DNM-SQ5M-9Q5H-JX3H-CMJK')
        .setEnvironmentName('sandbox')
        .setRedirectUri('http://localhost:9000/#!/auth');
        //.setEnvironmentName('beta')
        //.setRedirectUri('http://demo.werelate.org/#/auth');
    })

    .config(function(fsLocationProvider) {
      var prefix = '/#';
      fsLocationProvider.configure({
        getPersonLocation: function(personId) {
          return {
            prefix: prefix,
            path: '/person/'+personId
          };
        },
        getCoupleLocation: function(coupleId) {
          return {
            prefix: prefix,
            path: '/couple/'+coupleId
          };
        },
        getParentsLocation: function(parentsId) {
          return {
            prefix: prefix,
            path: '/parents/' + parentsId
          };
        },
        getTreeLocation: function(personId, opts) {
          return {
            prefix: prefix,
            path: '/tree/'+personId,
            search: opts
          };
        },
        getFindAddLocation: function(opts) {
          return {
            prefix: prefix,
            path: '/find-add',
            search: opts
          };
        },
        getSourceBoxLocation: function(opts) {
          return {
            prefix: prefix,
            path: '/source-box',
            search: opts
          };
        }
      });
    })

    .run(function () {
    })

    .controller('AppController', function ($scope) {
      $scope.environment = 'Sandbox';
      //$scope.environment = 'Beta';

      // don't forget to edit index.html to add {Track:js} script on demo

      $scope.$on('$stateChangeStart', function(event, toState) {
        if (toState.resolve) {
          $scope.busy = true;
        }
      });
      $scope.$on('$stateChangeSuccess', function() {
        $scope.busy = false;
      });
      $scope.$on('$stateChangeError', function() {
        $scope.busy = false;
      });

    });

})();
