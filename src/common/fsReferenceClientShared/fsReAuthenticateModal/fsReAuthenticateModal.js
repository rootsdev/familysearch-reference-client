(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsReAuthenticateModal', function($modal, fsApi) {
      return {
        open: function() {
          return $modal.open({
            templateUrl: 'fsReferenceClientShared/fsReAuthenticateModal/fsReAuthenticateModal.tpl.html',
            size: 'sm',
            controller: function($scope) {
              $scope.signin = function() {
                fsApi.getAccessToken().then(function() {
                  $scope.$close();
                });
              };
            }
          }).result;
        }
      };
    });
})();