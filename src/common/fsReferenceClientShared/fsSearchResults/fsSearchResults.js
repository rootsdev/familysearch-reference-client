(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsSearchResults', function(fsApi) {
      return {
        templateUrl: 'fsReferenceClientShared/fsSearchResults/fsSearchResults.tpl.html',
        scope: {
          results: '=',
          context: '=',
          count: '=',
          pageSize: '=',
          start: '='
        },
        link: function(scope) {
          scope.currentPage = 1;

          scope.$watch(function() {
            return scope.results;
          }, function() {
            scope.begin = scope.start + 1;
            scope.end = Math.min(scope.count, scope.start + scope.pageSize);
          });

          scope.pageChanged = function(page) {
            scope.busy = true;
            fsApi.getPersonSearch({
              start: (page-1) * scope.pageSize,
              count: scope.pageSize,
              context: scope.context
            }).then(function(response) {
              scope.results = response.getSearchResults();
              scope.context = response.getContext();
              scope.count = response.getResultsCount();
              scope.start = response.getIndex();
              scope.currentPage = page;
              scope.busy = false;
            });
          };

        }
      };
    });
})();