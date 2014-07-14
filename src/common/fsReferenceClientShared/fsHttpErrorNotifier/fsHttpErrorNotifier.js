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
              text: response.statusText + ' (' + response.status + ')'
            });
            return $q.reject(response);
          }
        }
      };
    });
})();