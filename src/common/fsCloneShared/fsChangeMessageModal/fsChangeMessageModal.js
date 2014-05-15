(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsChangeMessageModal', function fsChangeMessageModal(_, $modal) {
      return {
        open: function(opts) { // {title, subTitle, okLabel}
          return $modal.open({
            templateUrl: 'fsCloneShared/fsChangeMessageModal/fsChangeMessageModal.tpl.html',
            size: 'sm',
            controller: function($scope) {
              _.extend($scope, opts);

              $scope.ok = function(changeMessage) {
                $scope.$close(changeMessage);
              };

              $scope.cancel = function() {
                $scope.$dismiss();
              };
            }
          }).result;
        }
      };
    });
})();