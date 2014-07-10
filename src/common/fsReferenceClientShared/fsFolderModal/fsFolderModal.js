(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsFolderModal', function fsFolderModal($modal) {
      return {
        open: function(title) {
          return $modal.open({
            templateUrl: 'fsReferenceClientShared/fsFolderModal/fsFolderModal.tpl.html',
            size: 'sm',
            controller: function($scope) {
              $scope.title = title;

              $scope.ok = function(title) {
                $scope.$close(title);
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