(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsDeleteConfirmationModal', function(_, $modal) {
      return {
        open: function(opts) { // { person | (couple, husband, wife) | (parents, child, father, mother), item}
          return $modal.open({
            templateUrl: 'fsReferenceClientShared/fsDeleteConfirmationModal/fsDeleteConfirmationModal.tpl.html',
            size: 'lg',
            windowClass: 'deleteDialog',
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