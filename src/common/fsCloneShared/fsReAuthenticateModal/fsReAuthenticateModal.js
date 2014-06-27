(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsReAuthenticateModal', function($modal, fsApi) {
      return {
        open: function() {
          return $modal.open({
            templateUrl: 'fsCloneShared/fsReAuthenticateModal/fsReAuthenticateModal.tpl.html',
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