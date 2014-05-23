(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFindAddPerson', function(fsApi) {
      return {
        templateUrl: 'fsCloneShared/fsFindAddPerson/fsFindAddPerson.tpl.html',
        scope: {
          husbandId: '@',
          wifeId: '@',
          fatherId: '@',
          motherId: '@',
          childId: '@',
          returnToId: '@'
        },
        link: function(scope) {
          console.log('got here');
          scope.showResults = false;

          scope.$on('search', function(event, query) {
            event.stopPropagation();

            console.log('query', query);

            fsApi.getPersonSearch(query).then(function(response) {
              scope.results = response.getSearchResults();
              scope.context = response.getContext();
              scope.start = response.getIndex();
              scope.showResults = true;

              console.log('results', scope.results);
            });
          });
        }
      };
    });
})();
