(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsReAuthenticateModal', function($modal, $rootScope, fsApi) {
      return {
        open: function() {
          return $modal.open({
            templateUrl: 'fsReferenceClientShared/fsReAuthenticateModal/fsReAuthenticateModal.tpl.html',
            size: 'sm',
            controller: function($scope) {
              $scope.signin = function() {
                $scope.$close();
                fsApi.getAccessToken().then(function() {
                  $rootScope.$emit('newSession');
                });
              };
            }
          }).result;
        }
      };
    });
})();