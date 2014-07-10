(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsRestoreChangeModal', function($modal, $rootScope, fsChangeUtils, fsAgentCache) {

      // get the current value of the change, formatted like a change
      function getCurrent(opts) {
        var attrName;
        var objectModifier;
        var optsObject;
        if (fsChangeUtils.isChildAndParentsRelationshipModified(opts.change)) {
          attrName = 'child-and-parents-relationships';
          objectModifier = 'http://familysearch.org/v1/ChildAndParentsRelationship';
          optsObject = opts.parents;
        }
        else if (fsChangeUtils.isPersonModified(opts.change)) {
          attrName = 'persons';
          objectModifier = 'http://gedcomx.org/Person';
          optsObject = opts.person;
        }
        else if (fsChangeUtils.isCoupleRelationshipModified(opts.change)) {
          attrName = 'relationships';
          objectModifier = 'http://gedcomx.org/Couple';
          optsObject = opts.couple;
        }
        else {
          console.log('fsRestoreChangeModal null contentRoot', opts.change);
          return null;
        }

        var itemId = fsChangeUtils.getChangedItemId(opts.change);
        var contentRoot;
        var attribution;
        var objectType;
        var persons;

        if (fsChangeUtils.isName(opts.change)) {
          var name = _.find(opts.person.$getNames(), {id: itemId});
          if (!!name) {
            contentRoot = {names: [name]};
            attribution = name.attribution;
            objectType = name.type;
          }
        }
        else if (fsChangeUtils.isFact(opts.change) || fsChangeUtils.isLifeSketch(opts.change)) {
          var facts, factsLabel;
          if (objectModifier === 'http://familysearch.org/v1/ChildAndParentsRelationship') {
            if (!!fsChangeUtils.getContentRoot(opts.change).fatherFacts) {
              facts = optsObject.$getFatherFacts();
              factsLabel = 'fatherFacts';
            }
            else if (!!fsChangeUtils.getContentRoot(opts.change).motherFacts) {
              facts = optsObject.$getMotherFacts();
              factsLabel = 'motherFacts';
            }
          }
          else {
            facts = optsObject.$getFacts();
            factsLabel = 'facts';
          }
          if (!!facts) {
            var fact = _.find(facts, {id: itemId});
            if (!!fact) {
              contentRoot = {};
              contentRoot[factsLabel] = [fact];
              attribution = fact.attribution;
              objectType = fact.type;
            }
          }
        }
        else if (fsChangeUtils.isGender(opts.change)) {
          if (!!opts.person.gender) {
            contentRoot = {gender: opts.person.gender};
            attribution = opts.person.gender.attribution;
            objectType = 'http://gedcomx.org/Gender';
          }
        }
        else if (fsChangeUtils.isSourceReference(opts.change)) {
          // FamilySearch doesn't allow restoring source references
          contentRoot = {sources: [{}]};
          objectType = 'http://gedcomx.org/SourceReference';
        }
        else if (fsChangeUtils.isNote(opts.change)) {
          // FamilySearch doesn't display current info on notes; why should we go to the trouble?
          contentRoot = {notes: [{}]};
          objectType = 'http://gedcomx.org/Note';
        }
        else if (fsChangeUtils.isDiscussionReference(opts.change)) {
          // FamilySearch doesn't display current info on discussions; why should we go to the trouble?
          contentRoot = {'discussion-references': [{}]};
          objectType = 'http://familysearch.org/v1/DiscussionReference';
        }
        else if (fsChangeUtils.isCoupleRelationship(opts.change)) {
          objectType = opts.change.changeInfo[0].objectType;
          if (objectType === 'http://familysearch.org/v1/Man') {
            contentRoot = {person1: {resourceId: opts.husband.id}};
            persons = [opts.husband];
          }
          else {
            contentRoot = {person2: {resourceId: opts.wife.id}};
            persons = [opts.wife];
          }
        }
        else if (fsChangeUtils.isChildAndParentsRelationship(opts.change)) {
          objectType = opts.change.changeInfo[0].objectType;
          if (objectType === 'http://familysearch.org/v1/Father') {
            contentRoot = {father: {resourceId: opts.father.id}};
            persons = [opts.father];
          }
          else {
            contentRoot = {mother: {resourceId: opts.mother.id}};
            persons = [opts.mother];
          }
        }

        var current = {
          changeInfo: [{
            objectType: objectType,
            objectModifier: objectModifier
          }],
          attribution: attribution,
          content: {
            gedcomx: {}
          }
        };
        current.content.gedcomx[attrName] = [contentRoot];
        if (!!persons) {
          current.content.gedcomx.persons = persons;
        }

        current.$getChangeReason = function() {
          return current.attribution ? current.attribution.changeMessage : '';
        };
        if (current.attribution) {
          fsAgentCache.getAgent(current.attribution.$getAgentUrl() || current.attribution.$getAgentId()).then(function(agent) {
            current.agentName = agent.$getAccountName();
          });
        }

        return current;
      }

      return {
        open: function(opts) {
          return $modal.open({
            templateUrl: 'fsReferenceClientShared/fsRestoreChangeModal/fsRestoreChangeModal.tpl.html',
            size: 'lg',
            controller: function($scope) {
              $scope.change = opts.change;
              $scope.person = opts.person;
              $scope.couple = opts.couple;
              $scope.husband = opts.husband;
              $scope.wife = opts.wife;
              $scope.parents = opts.parents;
              $scope.father = opts.father;
              $scope.mother = opts.mother;
              $scope.child = opts.child;

              $scope.current = getCurrent(opts);

              $scope.cancel = function() {
                $scope.$dismiss();
              };

              $scope.restore = function() {
                $scope.busy = true;
                opts.change.$restore().then(function() {
                  $rootScope.$emit('restored', opts.change);
                  $scope.$close();
                });
              };

            }
          }).result;
        }
      };
    });
})();