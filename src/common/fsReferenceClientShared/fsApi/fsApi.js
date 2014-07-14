(function () {
  'use strict';
  angular.module('fsReferenceClientShared')
    .provider('fsApi', function() {
      /* jshint camelcase:false */
      var client_id = '';
      var environment = '';
      var redirect_uri = '';

      this.setClientId = function(appKey) {
        client_id = appKey;
        return this;
      };

      this.setEnvironmentName = function(environmentName) {
        environment = environmentName;
        return this;
      };

      this.setRedirectUri = function(authCallback) {
        redirect_uri = authCallback;
        return this;
      };

      this.$get = function($window, $http, $q, $timeout, $rootScope) {
        if ( client_id && environment && redirect_uri ) {
          $window.FamilySearch.init({
            client_id: client_id,
            environment: environment,
            redirect_uri: redirect_uri,
            http_function: $http,
            deferred_function: $q.defer,
            timeout_function: $timeout,
            save_access_token: true,
            auto_expire: true,
            auto_signin: false,
            expire_callback: function() {
              $rootScope.$emit('sessionExpired');
            }
          });
        }

        $window.FamilySearch.Person.prototype._isMale = function () {
          return this.gender && this.gender.type === 'http://gedcomx.org/Male';
        };

        return $window.FamilySearch;
      };

    });
})();
