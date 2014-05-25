(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFindAddPerson', function(_, fsApi) {
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
          scope.showResults = false;
          scope.pageSize = 20;

          // restrict gender if find/add spouse
          if (scope.husbandId) {
            scope.gender = 'female';
          }
          else if (scope.wifeId) {
            scope.gender = 'male';
          }

          scope.$on('search', function(event, query) {
            event.stopPropagation();

            console.log('query', query);

            if (query.id) { // find by id
              fsApi.getPersonWithRelationships(query.id, {persons: true}).then(function(response) {
                scope.results = [{
                  $getPrimaryPerson: _.bind(response.getPrimaryPerson, response),
                  $getFatherIds: _.bind(response.getFatherIds, response),
                  $getFathers: _.bind(response.getFathers, response),
                  $getMotherIds: _.bind(response.getMotherIds, response),
                  $getMothers: _.bind(response.getMothers, response)
                }];
                scope.context = null;
                scope.count = 1;
                scope.start = 0;
                scope.showResults = true;
              }, function() {
                scope.results = [];
                scope.context = null;
                scope.count = 0;
                scope.start = 0;
                scope.showResults = true;
              });
            }
            else {
              fsApi.getPersonSearch(_.extend({count: scope.pageSize}, query)).then(function(response) {
                scope.results = response.getSearchResults();
                scope.context = response.getContext();
                scope.count = response.getResultsCount();
                scope.start = response.getIndex();
                scope.showResults = true;
              });
            }
          });

          scope.$on('refine', function(event, reset) {
            event.stopPropagation();
            if (reset) {
              scope.$broadcast('clear'); // tell form to re-init
            }
            scope.showResults = false;
          });

        }
      };
    });
})();
