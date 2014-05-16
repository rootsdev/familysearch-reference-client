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
    })

    .directive('fsTreeCoupleCard',function() {
      return {
        restrict: 'E',
        scope: {
          person: '=',
          spouse: '='
        },
        templateUrl: 'fsCloneShared/fsTree/fsTreeCoupleCard.tpl.html'

      };
    })


    .directive('fsTree1',function() {
      return {
        scope: {
          person: '=',
          spouse: '=',
          expandable: '@'
        },
        templateUrl: 'fsCloneShared/fsTree/fsTree1.tpl.html',
        controller: function() {
        }

      };
    })

    .directive('fsTree2',function() {
      return {
        scope: {
          person: '=',
          spouse: '='
        },
        templateUrl: 'fsCloneShared/fsTree/fsTree2.tpl.html'

      };
    })

    .directive('fsTree3',function() {
      return {
        scope: {
          person: '=',
          spouse: '='
        },
        templateUrl: 'fsCloneShared/fsTree/fsTree3.tpl.html'

      };
    })

    .directive('fsTree4',function() {
      return {
        scope: {
          person: '=',
          spouse: '='
        },
        templateUrl: 'fsCloneShared/fsTree/fsTree4.tpl.html'

      };
    })


  ;
})();
