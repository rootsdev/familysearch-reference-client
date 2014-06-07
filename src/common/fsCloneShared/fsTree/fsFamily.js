(function() {
  'use strict';

  angular.module('fsCloneShared').factory('Family', function(_,fsApi, $q) {

    function coerce2PersonId(thing) {
      if (_.isNull(thing) || _.isUndefined(thing)) {
        return thing;
      }

      if (_.isString(thing)) {
        return thing;
      }


      if (thing.id) {
        return thing.id;
      }

      return thing.toString();
    }

    function initPersonDescriptionAsync(personDescription, person) {
      if (_.isNull(person) || _.isUndefined(person) ) {
        var deferred = $q.defer();
        deferred.resolve(personDescription);
        return deferred.promise;
      }

      var personID = coerce2PersonId(person);

      return fsApi.getPersonWithRelationships(personID, {persons: true}).then(function(response) {
        personDescription.relationships = response;
        personDescription.person = response.getPrimaryPerson();

        var spousePromise = fsApi.getPreferredSpouse(personID).then(function(response) {
          if ( response!=null ) {
            var couple =  _.find(personDescription.relationships.getSpouseRelationships(), function(it){
              return it.id===response;
            });
            if (couple) {
              personDescription.defaultSpouse = personDescription.relationships.getPerson(couple.$getSpouseId(personID));
              return;
            }
          }

          if ( personDescription.relationships.getSpouses() && personDescription.relationships.getSpouses().length ) {
            personDescription.defaultSpouse =  personDescription.relationships.getSpouses()[0];
          }
        });

        var parentsPromise = fsApi.getPreferredParents(personID).then(function(response){
          if ( response!=null ) {
            var parents = _.find(personDescription.relationships.getParentRelationships(),function(it){
              return it.id===response;
            });
            if ( parents ) {
              personDescription.defaultParents = parents;
              return;
            }
          }
          if ( personDescription.relationships.getParentRelationships() && personDescription.relationships.getParentRelationships().length) {
            personDescription.defaultParents = personDescription.relationships.getParentRelationships()[0];
          }
        });

        return $q.all([spousePromise,parentsPromise]);
      });
    }

    /**
     * @param person
     * @constructor
     */
    function PersonDescription(person) {
      this.initializationPromise = initPersonDescriptionAsync(this,person);
    }

    PersonDescription.prototype = {
      relationships: null,
      defaultParents: null,
      defaultSpouse: null,
      person: null,

      displayName: function() {
        if ( this===null || this.person===null ) {
          return '';  // happens when called before the promise is completed.
        }
        var result = this.person.$getPreferredName();
        if ( !_.isString(result)) {
          result = result.$getFullText();
        }
        return result;
      },

      allSpouses: function() {
          return this.relationships ? this.relationships.getSpouses() : [];
      }
    };

    function setPersonAndSpouse(that,person,spouse,referenceId) {
      if ( !person ) {
        var tmp = person;  // important to preserve null vs undefined.
        person = spouse;
        spouse = tmp;
      }
      function initHusbandAndWife() {
        if ( that.personDescription && that.personDescription.person && that.personDescription.person._isMale() ) {
          that.husbandDescription = that.personDescription;
          that.wifeDescription = that.spouseDescription;
        } else {
          that.husbandDescription = that.spouseDescription;
          that.wifeDescription = that.personDescription;
        }
      }
      if ( referenceId ) {
        that.referenceId = referenceId;
      }
      that.personDescription = new PersonDescription(person);
      var result = that.personDescription.initializationPromise;

      if ( !_.isUndefined(spouse) ) {
        that.spouseDescription = new PersonDescription(spouse);
        result = $q.all([that.personDescription.initializationPromise, that.spouseDescription.initializationPromise]).then(function(){
          initHusbandAndWife();
        });
      } else {
        result = that.personDescription.initializationPromise.then(function(){
          that.spouseDescription = new PersonDescription(that.personDescription.defaultSpouse);
          return that.spouseDescription.initializationPromise.then(function(){
            initHusbandAndWife();
          });
        });
      }
      return result;
    }

    function referenceIdOf(description) {
      return (description && description.person && description.person.id) ? description.person.id : undefined;
    }

    function FamilyConstructor() {
    }

    FamilyConstructor.prototype = {
      build: function(person,spouse,referenceId) {
        var result = new FamilyConstructor();
        result.initializationPromise = setPersonAndSpouse(result,person,spouse,referenceId);
        return result;
      },

      parentFamilyOfHusband: function() {
        if ( this.cachedFamilyOfHusbandsParents ) {
          return this.cachedFamilyOfHusbandsParents;
        }
        var that = this;
        this.cachedFamilyOfHusbandsParents = new FamilyConstructor();
        this.cachedFamilyOfHusbandsParents.initializationPromise = this.initializationPromise.then(function(){
            that.cachedFamilyOfHusbandsParents.referenceId = referenceIdOf(that.husbandDescription);

            if ( that.husbandDescription && that.husbandDescription.defaultParents ) {
              var parents = that.husbandDescription.defaultParents;
              var fatherId = parents.father ? parents.father.resourceId : null;
              var motherId = parents.mother ? parents.mother.resourceId : null;
              return setPersonAndSpouse(that.cachedFamilyOfHusbandsParents, fatherId, motherId, referenceIdOf(that.husbandDescription));
            }
        });
        return this.cachedFamilyOfHusbandsParents;
      },

      switchPaternalParents: function(newParents) {
        var that = this;
        var fatherId = newParents.father ? newParents.father.id : null;
        var motherId = newParents.mother ? newParents.mother.id : null;
        var newFamily = FamilyConstructor.prototype.build(fatherId,motherId,referenceIdOf(that.husbandDescription));
        this.cachedFamilyOfHusbandsParents = null;
        newFamily.initializationPromise.then(function(){
          that.cachedFamilyOfHusbandsParents = newFamily;
        });
      },

      switchMaternalParents: function(newParents) {
        var that = this;
        var fatherId = newParents.father ? newParents.father.id : null;
        var motherId = newParents.mother ? newParents.mother.id : null;
        var newFamily = FamilyConstructor.prototype.build(fatherId,motherId,referenceIdOf(that.wifeDescription));
        this.cachedFamilyOfWifesParents = null;
        newFamily.initializationPromise.then(function(){
          that.cachedFamilyOfWifesParents = newFamily;
        });
      },

      parentFamilyOfWife: function() {
        if ( this.cachedFamilyOfWifesParents ) {
          return this.cachedFamilyOfWifesParents;
        }
        var that = this;
        this.cachedFamilyOfWifesParents = new FamilyConstructor();
        this.cachedFamilyOfWifesParents.initializationPromise = this.initializationPromise.then(function(){
          that.cachedFamilyOfWifesParents.referenceId = referenceIdOf(that.wifeDescription);

          if ( that.wifeDescription && that.wifeDescription.defaultParents ) {
            var parents = that.wifeDescription.defaultParents;
            var fatherId = parents.father ? parents.father.resourceId : null;
            var motherId = parents.mother ? parents.mother.resourceId : null;
            return setPersonAndSpouse(that.cachedFamilyOfWifesParents, fatherId, motherId,that.wifeDescription.person.id);
          }
        });
        return this.cachedFamilyOfWifesParents;
      },

      nameOf: function(description) {
        if ( !description ) {
          return '';
        }
        description = description.person ? description.person : description;

        var result = description.person.$getPreferredName();
        if ( !_.isString(result) ) {
          result = result.$getFullText();
        }
        return result;
      },

      alternateHusbands: function() {
        if ( !this.hasAlternateHusbands() ) {
          return [];
        }
        return this.wifeDescription.relationships.getSpouses();

      },

      alternateWives: function() {
        if ( !this.hasAlternateWives() ) {
          return [];
        }
        return this.husbandDescription.relationships.getSpouses();
      },

      children: function() {
        if ( !this.hasChildren() ) {
          return [];
        }
        if ( this.hasWife() && this.hasHusband()) {
          return this.husbandDescription.relationships.getChildrenOf(this.wifeDescription.person.id);
        }
        if ( this.hasHusband() ) {
          return this.husbandDescription.relationships.getChildrenOf(null);
        }
        return this.wifeDescription.relationships.getChildrenOf(null);

      },

      childFamilies: function() {
        if ( this.cachedChildFamilies ) {
          return this.cachedChildFamilies;
        }
        if ( !this.hasChildren() ) {
          return [];
        }
        var result = _.map(this.children(),function(child){
          return FamilyConstructor.prototype.build(child);
        });
        this.cachedChildFamilies = result;
        return result;

      },

      alternatePaternalParents: function() {
        if (!_.isUndefined(this.cachedAlternatePaternalParents) ) {
          return this.cachedAlternatePaternalParents;
        }
        if ( !this.hasAlternatePaternalParents()) {
          return [];
        } else {
          var that = this;
          var parentRelationships = this.husbandDescription.relationships.getParentRelationships();
          var parents = _.map(parentRelationships,function(onePairOfParents){
            return {
              father:  onePairOfParents.$getFatherId() ? that.husbandDescription.relationships.getPerson( onePairOfParents.$getFatherId() ) : null,
              mother: onePairOfParents.$getMotherId() ? that.husbandDescription.relationships.getPerson( onePairOfParents.$getMotherId() ) : null
            };
          });
          this.cachedAlternatePaternalParents = _.toArray(parents);
        }
        return this.cachedAlternatePaternalParents;
      },

      alternateMaternalParents: function() {
        if (!_.isUndefined(this.cachedAlternateMaternalParents) ) {
          return this.cachedAlternateMaternalParents;
        }
        if ( !this.hasAlternateMaternalParents()) {
          return [];
        } else {
          var that = this;
          var parentRelationships = this.wifeDescription.relationships.getParentRelationships();
          var parents = _.map(parentRelationships,function(onePairOfParents){
            return {
              father:  onePairOfParents.$getFatherId() ? that.wifeDescription.relationships.getPerson( onePairOfParents.$getFatherId() ) : null,
              mother: onePairOfParents.$getMotherId() ? that.wifeDescription.relationships.getPerson( onePairOfParents.$getMotherId() ) : null
            };
          });
          this.cachedAlternateMaternalParents = _.toArray(parents);
        }
        return this.cachedAlternateMaternalParents;
      },

      hasHusband: function() {
        return this.husbandDescription && this.husbandDescription.person && this.husbandDescription.person.id && this.husbandDescription.relationships;
      },

      hasWife: function() { return !!this.wifeDescription && this.wifeDescription.relationships; },

      hasAlternateHusbands: function() {
        return this.hasWife() && this.wifeDescription.allSpouses().length > 1;
      },
      hasAlternateWives: function() {
        return this.hasHusband() && this.husbandDescription.allSpouses().length > 1;
      },

      hasAlternatePaternalParents: function() {
        return this.hasHusband() && this.husbandDescription.relationships.getParentRelationships().length > 1;
      },
      hasAlternateMaternalParents: function() {
        return this.hasWife() && this.wifeDescription.relationships.getParentRelationships().length > 1;
      },
      hasChildren: function() {
        if ( this.hasWife() && this.hasHusband()) {
          return this.husbandDescription.relationships.getChildRelationshipsOf(this.wifeDescription.person.id).length>0;
        }
        if ( this.hasHusband()) {
          return this.husbandDescription.relationships.getChildRelationshipsOf(null).length>0;
        }
        return this.hasWife() && this.wifeDescription.relationships.getChildRelationshipsOf(null).length>0;
      },
      isUseless: function() {
        return !this.hasHusband() && !this.hasWife() && !this.referenceId;
      },


      husbandDescription: null,
      wifeDescription: null



    };


    return FamilyConstructor;
  });


})();