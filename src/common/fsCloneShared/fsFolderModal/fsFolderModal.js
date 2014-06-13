(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsFolderModal', function fsFolderModal($modal) {
      return {
        open: function(title) {
          return $modal.open({
            templateUrl: 'fsCloneShared/fsFolderModal/fsFolderModal.tpl.html',
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