(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsRestoreChangeModal', function($modal) {
      return {
        open: function(change) {
          return $modal.open({
            templateUrl: 'fsCloneShared/fsRestoreChangeModal/fsRestoreChangeModal.tpl.html',
            size: 'lg',
            controller: function($scope) {
              console.log('fsRestoreChangeModal', change);
              $scope.change = change;

              $scope.cancel = function() {
                $scope.$dismiss();
              };

              $scope.restore = function() {
                // TODO restore change
                $scope.$close();
              };

            }
          }).result;
        }
      };
    });
})();