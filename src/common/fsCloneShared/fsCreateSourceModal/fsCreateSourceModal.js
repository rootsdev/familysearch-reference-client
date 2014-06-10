(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsCreateSourceModal', function(_, $modal, fsUtils) {
      return {
        open: function() {
          return $modal.open({
            templateUrl: 'fsCloneShared/fsCreateSourceModal/fsCreateSourceModal.tpl.html',
            size: 'lg',
            controller: function($scope) {
              $scope.form = {
                title: '',
                url: '',
                citation: '',
                notes: ''
              };

              $scope.save = function() {
                $scope.submitted = true;
                // this mimics FS behavior
                $scope.form.url = fsUtils.makeUrl($scope.form.url);
                if ($scope.form.title) {
                  $scope.$close($scope.form);
                }
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