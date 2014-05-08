(function(){
  'use strict';
  angular.module('fsCloneShared')
    .provider('fsApi', function fsApiProvider(){
        var app_key = 'WCQY-7J1Q-GKVV-7DNM-SQ5M-9Q5H-JX3H-CMJK';
        var environment = 'sandbox';
        var auth_callback = 'http://localhost:9000/#!/auth';

        this.setAppKey = function(appKey) {
          app_key = appKey;
        };

        this.setEnvironmentName = function(environmentName) {
          environment = environmentName;
        };

        this.setAuthCallback = function(authCallback) {
          auth_callback = authCallback;
        };

        this.$get = ['$window', '$http', '$q', '$timeout', function ($window,$http,$q,$timeout){
          $window.FamilySearch.init({
              app_key: app_key,
              environment: environment,
              auth_callback: auth_callback,
              http_function: $http,
              deferred_function: $q.defer,
              timeout_function: $timeout,
              save_access_token: true,
              auto_expire: true,
              auto_signin: true
          });

          $window.FamilySearch.Person.prototype._isMale = function() {
            return this.$getDisplayGender() === 'Male';
          };

          return $window.FamilySearch;

        }];

      });
})();
