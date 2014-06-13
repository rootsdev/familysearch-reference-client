(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsSourceAttachmentsModal', function($modal, $rootScope, fsUtils) {
      return {
        open: function(description) {
          return $modal.open({
            templateUrl: 'fsCloneShared/fsSourceAttachmentsModal/fsSourceAttachmentsModal.tpl.html',
            size: 'lg',
            controller: function($scope) {
              $scope.description = description;
              fsUtils.getSourceRefs(description, true, 0).then(function(response) {
                console.log('fsSourceAttachmentsModal', response);
                $scope.sourceRefs = response;
              });

              $scope.cancel = function() {
                $scope.$dismiss();
              };

              $scope.detach = function(sourceRef) {
                $scope.$close(sourceRef);
              };

            }
          }).result;
        }
      };
    });
})();