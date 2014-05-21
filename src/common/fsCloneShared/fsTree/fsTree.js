(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsTree', function (fsApi, $state) {
      return {
        templateUrl: 'fsCloneShared/fsTree/fsTree.tpl.html',
        scope: {
          person: '=',
          spouse: '='
        },
        controller: function($scope, fsApi, Family) {
            $scope.family = new Family($scope.person, $scope.spouse);

            $scope.config = {};
            $scope.model = {};

            $scope.navigateTo = function() {
                $state.go('person', { personId: $scope.person.id });
            };
        }
      };
    });
})();
