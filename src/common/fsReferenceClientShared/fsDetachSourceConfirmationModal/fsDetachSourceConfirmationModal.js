(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsDetachSourceConfirmationModal', function(_, $modal, fsAgentCache) {
      return {
        open: function(opts) { // {person | (husband, wife) | (child, father, mother), sourceRef}
          return $modal.open({
            templateUrl: 'fsReferenceClientShared/fsDetachSourceConfirmationModal/fsDetachSourceConfirmationModal.tpl.html',
            size: 'sm',
            controller: function($scope) {
              _.extend($scope, opts);

              if (opts.sourceRef.attribution) {
                fsAgentCache.getAgent(opts.sourceRef.attribution.$getAgentUrl() || opts.sourceRef.attribution.$getAgentId()).then(function(agent) {
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