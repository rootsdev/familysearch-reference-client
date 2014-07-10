(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsCreateSourceModal', function(_, $modal, fsUtils) {
      return {
        open: function(opts) { //{description, saveAndAttach}
          return $modal.open({
            templateUrl: 'fsReferenceClientShared/fsCreateSourceModal/fsCreateSourceModal.tpl.html',
            size: 'lg',
            controller: function($scope) {
              $scope.saveAndAttach = opts.saveAndAttach;
              $scope.form = {
                title: !!opts.description ? 'Copy of '+opts.description.$getTitle() : '',
                url: !!opts.description ? opts.description.about : '',
                citation: !!opts.description ? opts.description.$getCitation() : '',
                notes: !!opts.description ? opts.description.$getText() : ''
              };

              $scope.save = function(attach) {
                $scope.form.url = fsUtils.makeUrl($scope.form.url); // this mimics FS behavior
                $scope.form.attach = attach;
                $scope.$close($scope.form);
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