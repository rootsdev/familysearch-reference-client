(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsDetachSourceConfirmationModal', function fsDetachSourceConfirmationModal(_, $modal, fsAgentCache) {
      return {
        open: function(opts) { // {person | (husband, wife), sourceRef}
          return $modal.open({
            templateUrl: 'fsCloneShared/fsDetachSourceConfirmationModal/fsDetachSourceConfirmationModal.tpl.html',
            size: 'sm',
            controller: function($scope) {
              _.extend($scope, opts);

              if (opts.sourceRef.attribution) {
                fsAgentCache.getAgent(opts.sourceRef.attribution.$getAgentUrl()).then(function(agent) {
                  $scope.agent = agent;
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