(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsUserCache', function($q, fsApi) {
      var user = null;

      return {
        // TODO listen for changes to sign-in
        getUser: function() {
          if (!!user) {
            return $q.when(user);
          }
          else {
            return fsApi.getCurrentUser().then(function(response) {
              user = response.getUser();
              return user;
            });
          }
        }
      };
    });
})();