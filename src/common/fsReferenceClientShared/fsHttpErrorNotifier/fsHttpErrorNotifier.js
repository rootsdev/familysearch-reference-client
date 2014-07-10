(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .config(function($httpProvider) {
      $httpProvider.interceptors.push('fsHttpErrorNotifier');
    })

    .factory('fsHttpErrorNotifier', function($q, $rootScope, $injector) {
      return {
        responseError: function(response) {
          if (response.status === 401) {
            var fsReAuthenticateModal = $injector.get('fsReAuthenticateModal');
            var $http = $injector.get('$http');
            return fsReAuthenticateModal.open().then(function() {
              return $http(response.config);
            });
          }
          else {
            $rootScope.$emit('alert', {
              level: 'error',
              // TODO eventually remove the URL
              text: response.statusText + ' (' + response.status + ')<br>' + response.config.url
            });
            return $q.reject(response);
          }
        }
      };
    });
})();