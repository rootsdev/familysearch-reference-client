(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsChangeUtils', function(_, fsNameTypes, fsVitalFactTypes, fsOtherFactTypes) {

      function getType(change) {
        return change.changeInfo[0].objectType;
      }

      function getModifiedObjectType(change) {
        return change.changeInfo[0].objectModifier || getType(change);
      }

      function isChildAndParentsRelationshipModified(change) {
        return getModifiedObjectType(change) === 'http://familysearch.org/v1/ChildAndParentsRelationship';
      }

      function isCoupleRelationshipModified(change) {
        return getModifiedObjectType(change) === 'http://gedcomx.org/Couple';
      }

      function isPersonModified(change) {
        return getModifiedObjectType(change) === 'http://gedcomx.org/Person';
      }

      function getContentRoot(change) {
        if (isChildAndParentsRelationshipModified(change)) {
          return change.content.gedcomx['child-and-parents-relationships'][0];
        }
        else if (isPersonModified(change)) {
          return change.content.gedcomx.persons[0];
        }
        else if (isCoupleRelationshipModified(change)) {
          return change.content.gedcomx.relationships[0];
        }
        console.log('getContentRoot null', change);
        return null;
      }

      function isChildAndParentsRelationship(change) {
        return _.contains([
          'http://familysearch.org/v1/Father',
          'http://familysearch.org/v1/Mother',
          'http://familysearch.org/v1/Child'
        ], getType(change));
      }

      function isCoupleRelationship(change) {
        return _.contains([
          'http://familysearch.org/v1/Man',
          'http://familysearch.org/v1/Woman'
        ], getType(change));
      }

      function isName(change) {
        var type = getType(change);
        return _.contains(fsNameTypes, type) ||
          type === 'http://gedcomx.org/Name'; // "other" name
      }

      function isFact(change) {
        var type = getType(change);
        return _.contains(fsVitalFactTypes, type) ||
          _.any(fsOtherFactTypes, { type: type}) ||
          type === 'http://gedcomx.org/Fact'; // "other" fact
      }

      function isGender(change) {
        return getType(change) === 'http://gedcomx.org/Gender';
      }

      function isSourceReference(change) {
        return getType(change) === 'http://gedcomx.org/SourceReference';
      }

      function isDiscussionReference(change) {
        return getType(change) === 'http://familysearch.org/v1/DiscussionReference';
      }

      function isNote(change) {
        return getType(change) === 'http://gedcomx.org/Note';
      }

      function isLifeSketch(change) {
        return getType(change) === 'http://familysearch.org/v1/LifeSketch';
      }

      function isDeletion(change) {
        return change.changeInfo[0].operation === 'http://familysearch.org/v1/Delete';
      }

      function isCreation(change) {
        return change.changeInfo[0].operation === 'http://familysearch.org/v1/Create';
      }

      function getAction(change) {
        if (isChildAndParentsRelationship(change) || isCoupleRelationship(change) ||
          isChildAndParentsRelationshipModified(change) || isCoupleRelationshipModified(change)) {
          return ''; // TODO could be "Reference" with a navigation event to the child-and-parents or couple relationship
        }
        else if (isDeletion(change)) {
          return isSourceReference(change) ? 'Detached' : 'Deleted';
        }
        else if (getType(change) === 'http://gedcomx.org/Person') { // covers person creation
          return '';
        }
        else {
          return 'Current';
        }
      }

      function getChangedItemId(change) {
        var contentRoot = getContentRoot(change);
        if (isName(change)) {
          return contentRoot.names[0].id;
        }
        else if (isFact(change) || isLifeSketch(change)) {
          if (isChildAndParentsRelationshipModified(change)) {
            return !!contentRoot.motherFacts ? contentRoot.motherFacts[0].id : contentRoot.fatherFacts[0].id;
          }
          else {
            return contentRoot.facts[0].id;
          }
        }
        else if (isGender(change)) {
          return contentRoot.gender.id;
        }
        else if (isSourceReference(change)) {
          return contentRoot.sources[0].id;
        }
        else if (isDiscussionReference(change)) {
          return contentRoot['discussion-references'][0].resource;
        }
        else if (isNote(change)) {
          return contentRoot.notes[0].id;
        }
        else if (isCoupleRelationship(change) || isChildAndParentsRelationship(change)) {
          return null; // no id available
        }
        else if (!!contentRoot) {
          return contentRoot.id;
        }
        console.log('getChangedItemId null', change);
        return null;
      }

      return {
        getType: getType,
        getModifiedObjectType: getModifiedObjectType,
        isChildAndParentsRelationshipModified: isChildAndParentsRelationshipModified,
        isCoupleRelationshipModified: isCoupleRelationshipModified,
        isPersonModified: isPersonModified,
        getContentRoot: getContentRoot,
        isName: isName,
        isFact: isFact,
        isGender: isGender,
        isSourceReference: isSourceReference,
        isChildAndParentsRelationship: isChildAndParentsRelationship,
        isCoupleRelationship: isCoupleRelationship,
        isDiscussionReference: isDiscussionReference,
        isNote: isNote,
        isLifeSketch: isLifeSketch,
        isDeletion: isDeletion,
        isCreation: isCreation,
        getAction: getAction,
        getChangedItemId: getChangedItemId
      };
    });
})();
