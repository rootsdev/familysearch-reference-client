(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsChangeUtils', function(_, fsNameTypes,
                                       fsVitalFactTypes, fsOtherFactTypes, fsCoupleFactTypes, fsParentFactTypes) {

      function getType(change) {
        var type = change.changeInfo[0].objectType;
        if (type === 'http://gedcomx.org/Fact') {
          var root = getContentRoot(change);
          if (root.facts && root.facts[0]) {
            type = root.facts[0].type;
          }
        }
        return type;
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
        var obj;
        if (isChildAndParentsRelationshipModified(change)) {
          obj = change.content.gedcomx['child-and-parents-relationships'];
        }
        else if (isPersonModified(change)) {
          obj = change.content.gedcomx.persons;
        }
        else if (isCoupleRelationshipModified(change)) {
          obj = change.content.gedcomx.relationships;
        }
        return isDeletion(change) && obj.length > 1 ? obj[1] : obj[0];
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
        return _.any(fsVitalFactTypes, {type: type}) ||
          _.any(fsOtherFactTypes, {type: type}) ||
          _.any(fsCoupleFactTypes, {type: type}) ||
          _.any(fsParentFactTypes, {type: type}) ||
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
        else if (isCoupleRelationship(change)) {
          return contentRoot.identifiers['http://gedcomx.org/Primary'][0];
        }
        else if (isChildAndParentsRelationship(change)) {
          return contentRoot.identifiers['http://gedcomx.org/Primary'][0];
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
        getChangedItemId: getChangedItemId
      };
    });
})();
