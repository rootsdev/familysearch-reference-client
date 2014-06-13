(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsAttachSourceConfirmationModal', function(_, $modal) {
      return {
        open: function(opts) { // {person | (husband, wife) | (child, father, mother)}
          return $modal.open({
            templateUrl: 'fsCloneShared/fsAttachSourceConfirmationModal/fsAttachSourceConfirmationModal.tpl.html',
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