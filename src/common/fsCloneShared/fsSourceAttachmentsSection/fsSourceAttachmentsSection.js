(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceAttachmentsSection', function($q, fsApi) {
      return {
        templateUrl: 'fsCloneShared/fsSourceAttachmentsSection/fsSourceAttachmentsSection.tpl.html',
        scope: {
          description: '=',
          max: '@'
        },
        link: function(scope) {
          var max = scope.max || -1;
          var total = 0;

          scope.description.$getSourceRefsQuery().then(function(response) {
            scope.personSourceRefs = [];
            response.getPersonSourceRefs().forEach(function(sourceRef) {
              if (max < 0 || total < max) {
                total++;
                fsApi.getPerson(sourceRef.$personId).then(function(response) {
                  scope.personSourceRefs.push({
                    person: response.getPerson()
                  });
                });
              }
            });

            scope.coupleSourceRefs = [];
            response.getCoupleSourceRefs().forEach(function(sourceRef) {
              if (max < 0 || total < max) {
                total++;
                fsApi.getCouple(sourceRef.$coupleId, {persons: true}).then(function(response) {
                  var couple = response.getRelationship();
                  scope.coupleSourceRefs.push({
                    husband: response.getPerson(couple.$getHusbandId()),
                    wife: response.getPerson(couple.$getWifeId())
                  });
                });
              }
            });

            scope.parentsSourceRefs = [];
            response.getChildAndParentsSourceRefs().forEach(function(sourceRef) {
              if (max < 0 || total < max) {
                total++;
                fsApi.getChildAndParents(sourceRef.$childAndParentsId, {persons: true}).then(function(response) {
                  var parents = response.getRelationship();
                  scope.parentsSourceRefs.push({
                    child: response.getPerson(parents.$getChildId()),
                    father: parents.$getFatherId() ? response.getPerson(parents.$getFatherId()) : null,
                    mother: parents.$getMotherId() ? response.getPerson(parents.$getMotherId()) : null
                  });
                });
              }
            });
          });

        }
      };
    });
})();