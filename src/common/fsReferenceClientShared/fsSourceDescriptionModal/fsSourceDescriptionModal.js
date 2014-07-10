(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsSourceDescriptionModal', function($modal, $rootScope, fsUtils) {
      return {
        open: function(description, isEditing) {
          return $modal.open({
            templateUrl: 'fsReferenceClientShared/fsSourceDescriptionModal/fsSourceDescriptionModal.tpl.html',
            size: 'lg',
            windowClass: 'familysearch_theme sourceDialog viewSource',
            controller: function($scope) {
              fsUtils.mixinStateFunctions($scope, description);
              if (isEditing) {
                description._edit();
              }
              else {
                description._open();
              }
              $scope.description = description;

              $scope.cancel = function() {
                $scope.$dismiss();
              };

              $scope.$on('delete', function(event) {
                event.stopPropagation();
                $scope.$close('delete');
              });

              $scope.$on('showAttachments', function(event) {
                event.stopPropagation();
                $scope.$close('showAttachments');
              });

              $scope.$on('save', function(event, description, changeMessage) {
                event.stopPropagation();
                description._busy = true;
                description.$save(changeMessage, true).then(function() {
                  description._busy = false;
                  description._open();
                  $rootScope.$emit('saved', description);
                });
              });

              // cancel save
              $scope.$on('cancel', function(event, description) {
                event.stopPropagation();
                description._open();
              });

            }
          }).result;
        }
      };
    });
})();