(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsConfirmationModal', function fsConfirmationModal(_, $modal) {
      return {
        open: function(opts) { // {title, subTitle, showChangeMessage, okLabel}
          return $modal.open({
            templateUrl: 'fsReferenceClientShared/fsConfirmationModal/fsConfirmationModal.tpl.html',
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