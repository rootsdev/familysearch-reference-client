(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsChangeHistoryModalEntry', function(_, fsApi, fsUtils, fsChangeUtils, fsAgentCache) {
      return {
        templateUrl: 'fsCloneShared/fsChangeHistoryModal/fsChangeHistoryModalEntry/fsChangeHistoryModalEntry.tpl.html',
        scope: {
          change: '='
        },
        link: function(scope) {
          console.log('fsChangeHistoryModalEntry', scope.change, fsChangeUtils.getType(scope.change));

          scope.setAgent = function() {
            if (!scope.agent) {
              fsAgentCache.getAgent(scope.change.$getAgentUrl()).then(function(agent) {
                scope.agent = agent;
              });
            }
          };

          // copy util functions into scope
          _.extend(scope, fsChangeUtils);

          scope.contentRoot = fsChangeUtils.getContentRoot(scope.change);

          if (fsChangeUtils.isSourceReference(scope.change)) {
            if (fsChangeUtils.isDeletion(scope.change)) {
              scope.sourceTitle = 'Title Unavailable';
            }
            else {
              fsApi.getSourceDescription(scope.contentRoot.sources[0].description).then(function(response) {
                scope.sourceTitle = response.getSourceDescription().$getTitle();
              }, function() {
                scope.sourcetitle = 'Title Unavailable';
              });
            }
          }

          if (fsChangeUtils.isChildAndParentsRelationship(scope.change) ||
              fsChangeUtils.isCoupleRelationship(scope.change)) {
            var type = fsChangeUtils.getType(scope.change);
            var pid = null;
            if (type === 'http://familysearch.org/v1/Father') {
              pid = scope.contentRoot.father.resourceId;
            }
            else if (type === 'http://familysearch.org/v1/Mother') {
              pid = scope.contentRoot.mother.resourceId;
            }
            else if (type === 'http://familysearch.org/v1/Child') {
              pid = scope.contentRoot.child.resourceId;
            }
            else if (type === 'http://familysearch.org/v1/Man') {
              pid = scope.contentRoot.person1.resourceId;
            }
            else if (type === 'http://familysearch.org/v1/Woman') {
              pid = scope.contentRoot.person2.resourceId;
            }
            scope.relatedPerson = fsUtils.setConstructor(_.find(scope.change.content.gedcomx.persons, function(person) {
              return person.id === pid;
            }), fsApi.Person);
            scope.relatedPerson.names = _.map(scope.relatedPerson.names, function(name) {
              return fsUtils.setConstructor(name, fsApi.Name);
            });
            scope.relatedPerson.facts = _.map(scope.relatedPerson.facts, function(fact) {
              return fsUtils.setConstructor(fact, fsApi.Fact);
            });
          }

        }
      };
    });
})();