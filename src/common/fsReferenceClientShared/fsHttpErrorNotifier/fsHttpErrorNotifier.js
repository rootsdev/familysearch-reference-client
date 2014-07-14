(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .config(function($httpProvider) {
      $httpProvider.interceptors.push('fsHttpErrorNotifier');
    })

    .factory('fsHttpErrorNotifier', function($q, $rootScope) {
      return {
        responseError: function(response) {
          $rootScope.$emit('alert', {
            level: 'error',
            text: response.statusText + ' (' + response.status + ')'
          });
          return $q.reject(response);
        }
      };
    });
})();