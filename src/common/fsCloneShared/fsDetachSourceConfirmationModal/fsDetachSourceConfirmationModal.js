(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsDetachSourceConfirmationModal', function fsDetachSourceConfirmationModal(_, $modal) {
      return {
        open: function(opts) { // {person, sourceRef}
          return $modal.open({
            templateUrl: 'fsCloneShared/fsDetachSourceConfirmationModal/fsDetachSourceConfirmationModal.tpl.html',
            size: 'sm',
            controller: function($scope) {
              _.extend($scope, opts);

              if (opts.sourceRef.attribution) {
                opts.sourceRef.attribution.$getAgent().then(function(response) {
                  $scope.agent = response.getAgent();
                  console.log('got agent', response.getAgent());
                });
              }

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