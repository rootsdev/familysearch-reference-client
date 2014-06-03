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
            $scope.family = Family.prototype.build($scope.person, $scope.spouse);

            $scope.config = {};
            $scope.model = {};

            $scope.navigateTo = function() {
                $state.go('person', { personId: $scope.person.id });
            };

          $scope.xxfamily = {
            name : 'Parent',
            children: [{
              name : 'Child1',
              children: [{
                name : 'Grandchild1',
                children: [{name:'bob',children:[]}]
              },{
                name : 'Grandchild2',
                children: []
              },{
                name : 'Grandchild3',
                children: []
              }]
            }, {
              name: 'Child2',
              children: []
            }]
          };
        }
      };
    });
})();
