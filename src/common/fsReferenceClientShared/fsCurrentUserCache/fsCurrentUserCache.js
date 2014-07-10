(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsCurrentUserCache', function($q, fsApi) {
      var currentUser = null;

      // TODO when SDK emits a gotAccessToken event, we need to listen to that and refresh the current user
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