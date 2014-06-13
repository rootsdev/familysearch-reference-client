(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsSourceUtils', function ($q, fsApi, fsAgentCache) {

      return {
        getSourceRefs: function(description, getAgents, max) {
          return description.$getSourceRefsQuery().then(function(response) {
            var promises = [];

            function getAgent(sourceRef) {
              return getAgents ? fsAgentCache.getAgent(sourceRef.attribution.$getAgentUrl()) : $q.when(null);
            }

            response.getPersonSourceRefs().forEach(function(sourceRef) {
              if (max <= 0 || promises.length < max) {
                promises.push($q.all([
                  fsApi.getPerson(sourceRef.$personId),
                  getAgent(sourceRef)
                ]).then(function(responses) {
                  return {
                    sourceRef: sourceRef,
                    person: responses[0].getPerson(),
                    agent: responses[1]
                  };
                }));
              }
            });

            response.getCoupleSourceRefs().forEach(function(sourceRef) {
              if (max <= 0 || promises.length < max) {
                promises.push($q.all([
                  fsApi.getCouple(sourceRef.$coupleId, {persons: true}),
                  getAgent(sourceRef)
                ]).then(function(responses) {
                  var couple = responses[0].getRelationship();
                  return {
                    sourceRef: sourceRef,
                    couple: couple,
                    husband: responses[0].getPerson(couple.$getHusbandId()),
                    wife: responses[0].getPerson(couple.$getWifeId()),
                    agent: responses[1]
                  };
                }));
              }
            });

            response.getChildAndParentsSourceRefs().forEach(function(sourceRef) {
              if (max <= 0 || promises.length < max) {
                promises.push($q.all([
                  fsApi.getChildAndParents(sourceRef.$childAndParentsId, {persons: true}),
                  getAgent(sourceRef)
                ]).then(function(responses) {
                  var parents = responses[0].getRelationship();
                  return {
                    sourceRef: sourceRef,
                    parents: parents,
                    child: responses[0].getPerson(parents.$getChildId()),
                    father: parents.$getFatherId() ? responses[0].getPerson(parents.$getFatherId()) : null,
                    mother: parents.$getMotherId() ? responses[0].getPerson(parents.$getMotherId()) : null,
                    agent: responses[1]
                  };
                }));
              }
            });

            return $q.all(promises);
          });
        }

      };
    });
})();