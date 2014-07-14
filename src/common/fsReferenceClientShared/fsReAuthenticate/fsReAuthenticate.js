(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsReAuthenticate', function($rootScope, fsReAuthenticateModal) {
      return {
        template: '<div></div>',
        link: function(scope) {
          var unbind = $rootScope.$on('sessionExpired', function() {
            fsReAuthenticateModal.open();
          });

          scope.$on('$destroy', unbind);
        }
      };
    });
})();