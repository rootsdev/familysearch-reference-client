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
          scope.setAgent = function() {
            if (!scope.agent) {
              fsAgentCache.getAgent(scope.change.$getAgentUrl()).then(function(agent) {
                scope.agent = agent;
              });
            }
          };

          scope.getAction = function(change) {
            if (fsChangeUtils.isDeletion(change)) {
              return fsChangeUtils.isSourceReference(change) ? 'Detached' : 'Deleted';
            }
            else if (fsChangeUtils.isChildAndParentsRelationship(change) || fsChangeUtils.isCoupleRelationship(change) ||
              fsChangeUtils.isChildAndParentsRelationshipModified(change) || fsChangeUtils.isCoupleRelationshipModified(change)) {
              return ''; // TODO could be "Reference" with a navigation event to the child-and-parents or couple relationship
            }
            else if (fsChangeUtils.getType(change) === 'http://gedcomx.org/Person') { // covers person creation
              return '';
            }
            else {
              return 'Current';
            }
          };

        }
      };
    });
})();