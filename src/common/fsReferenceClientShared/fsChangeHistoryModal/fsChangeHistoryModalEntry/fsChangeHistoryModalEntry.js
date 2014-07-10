(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsChangeHistoryModalEntry', function(_, fsApi, fsUtils, fsChangeUtils, fsAgentCache) {
      return {
        templateUrl: 'fsReferenceClientShared/fsChangeHistoryModal/fsChangeHistoryModalEntry/fsChangeHistoryModalEntry.tpl.html',
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
              // TODO could be "Reference" with a navigation event to the child-and-parents or couple relationship
              // if we're showing person changes, or Current if we're showing relationship changes
              return '';
            }
            else if (fsChangeUtils.getType(change) === 'http://gedcomx.org/Person') { // covers person creation
              return '';
            }
            else {
              return 'Current';
            }
          };

          scope.canRestore = function(change) {
            return !fsChangeUtils.isGender(change) && // can't restore gender changes
              !fsChangeUtils.isSourceReference(change); // can't restore source ref changes apparently
          };
        }
      };
    });
})();