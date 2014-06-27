(function () {
  'use strict';
  angular.module('fsCloneShared')
    .provider('fsApi', function() {
      /* jshint camelcase:false */
      var app_key = '';
      var environment = '';
      var auth_callback = '';

      this.setAppKey = function(appKey) {
        app_key = appKey;
        return this;
      };

      this.setEnvironmentName = function(environmentName) {
        environment = environmentName;
        return this;
      };

      this.setAuthCallback = function(authCallback) {
        auth_callback = authCallback;
        return this;
      };

      this.$get = function($window, $http, $q, $timeout) {
        if ( app_key && environment && auth_callback ) {
          $window.FamilySearch.init({
            app_key: app_key,
            environment: environment,
            auth_callback: auth_callback,
            http_function: $http,
            deferred_function: $q.defer,
            timeout_function: $timeout,
            save_access_token: true,
            auto_expire: true,
            auto_signin: false
          });
        }

        $window.FamilySearch.Person.prototype._isMale = function () {
          return this.gender && this.gender.type === 'http://gedcomx.org/Male';
        };

        return $window.FamilySearch;
      };

    });
})();
