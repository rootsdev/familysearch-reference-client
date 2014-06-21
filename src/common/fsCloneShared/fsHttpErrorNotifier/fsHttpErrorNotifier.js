(function(){
  'use strict';
  angular.module('fsCloneShared')
    .config(function($httpProvider) {
      $httpProvider.interceptors.push('fsHttpErrorNotifier');
    })

    .factory('fsHttpErrorNotifier', function($q, $rootScope) {
      return {
        responseError: function(rejection) {
          $rootScope.$emit('alert', {
            level: 'error',
            // TODO eventually remove the URL
            text: rejection.statusText + ' (' + rejection.status + ')<br>' + rejection.config.url
          });
          console.log('fsHttpErrorNotifier', rejection);
          return $q.reject(rejection);
        }
      };
    });
})();