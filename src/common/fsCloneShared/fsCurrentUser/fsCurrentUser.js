(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsCurrentUser', function fsCurrentUser($q, fsApi) {
      var currentUser;

      // TODO when SDK emits a gotAccessToken event, we need to listen to that and refresh the current user
      return {
        get: function(forceRefresh) {
          if (currentUser && !forceRefresh) {
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