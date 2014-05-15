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
        controller: function($scope) {
            var scope = $scope;
            scope.config = {};
            scope.model = {};

            scope.focus = function() {
                if (scope.sourcesCount === null) {
                    fsApi.getPersonSourceRefs(scope.person.id).then(function(response){
                        scope.sourcesCount = response ? response.getSourceRefs().length : 0;
                    });
                }
                if (scope.discussionsCount === null) {
                    fsApi.getPersonDiscussionRefs(scope.person.id).then(function(response){
                        scope.discussionsCount = response ? response.getDiscussionRefs().length : 0;
                    });
                }
            };

            scope.navigateTo = function() {
                $state.go('person', { personId: scope.person.id });
            };
        }
      };
    });
})();
