(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsCurrentUserCache', function($q, $rootScope, fsApi) {
      var currentUser = null;

      $rootScope.$on('newSession', function() {
        currentUser = null;
      });

      return {
        getUser: function() {
          if (!!currentUser) {
            return $q.when(currentUser);
          }
          else {
            return fsApi.getCurrentUser().then(function(response) {
              currentUser = response.getUser();
              return currentUser;
            });
          }
        }
      };
    });
})();