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

        var nestedPromises = [];

        var spouses =  personDescription.relationships.getSpouses();
        if (false && spouses && spouses.length===1 ) {
          personDescription.defaultSpouse =  spouses[0];
        } else {
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

            if (spouses && spouses.length  ) {
              personDescription.defaultSpouse =  spouses[0];
            }
          });
          nestedPromises.push(spousePromise);
        }


        var parentRelationships = personDescription.relationships.getParentRelationships();
        if ( false && parentRelationships && parentRelationships.length===1 ) {
          personDescription.defaultParents = parentRelationships[0];
        } else {
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
            if ( parentRelationships && parentRelationships.length ) {
              personDescription.defaultParents = parentRelationships[0];
            }
          });
          nestedPromises.push(parentsPromise);
        }
        return $q.all(nestedPromises);
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

//    function setPersonAndSpouse(that,person,spouse,referenceId) {
//      if ( !person ) {
//        var tmp = person;  // important to preserve null vs undefined.
//        person = spouse;
//        spouse = tmp;
//      }
//      function initHusbandAndWife() {
//        if ( that.personDescription && that.personDescription.person && that.personDescription.person._isMale() ) {
//          that.husbandDescription = that.personDescription;
//          that.wifeDescription = that.spouseDescription;
//        } else {
//          that.husbandDescription = that.spouseDescription;
//          that.wifeDescription = that.personDescription;
//        }
//      }
//      if ( referenceId ) {
//        that.referenceId = referenceId;
//      }
//      that.personDescription = new PersonDescription(person);
//      var result = that.personDescription.initializationPromise;
//
//      if ( !_.isUndefined(spouse) ) {
//        that.spouseDescription = new PersonDescription(spouse);
//        result = $q.all([that.personDescription.initializationPromise, that.spouseDescription.initializationPromise]).then(function(){
//          initHusbandAndWife();
//        });
//      } else {
//        result = that.personDescription.initializationPromise.then(function(){
//          that.spouseDescription = new PersonDescription(that.personDescription.defaultSpouse);
//          return that.spouseDescription.initializationPromise.then(function(){
//            initHusbandAndWife();
//          });
//        });
//      }
//      return result;
//    }

    function referenceIdOf(description) {
      return (description && description.person && description.person.id) ? description.person.id : undefined;
    }

    function FamilyConstructor(rootPerson) {
      if ( rootPerson ) {
        var personId = coerce2PersonId(rootPerson);
        this.initPerson(personId).then(_.bind(this.initSpouse,this)).then(_.bind(this.initAncestry,this) );
//        this.initializationPromise = setPersonAndSpouse(this,rootPerson);
      }
    }

    FamilyConstructor.prototype = {

      initPerson: function(personId) {
        var theFamily = this;
        return fsApi.getPersonWithRelationships(personId, {persons: true}).then(function(response) {
          theFamily.personWithRelationships = response;
          theFamily.person = response.getPrimaryPerson();
          return response;
        });

      },

      initSpouse: function() {
        var theFamily = this;
        var personId = theFamily.personWithRelationships.getPrimaryPerson().id;
        var spouses = theFamily.personWithRelationships.getSpouses();
        if (spouses && spouses.length === 1) {
          theFamily.spouse = spouses[0];
          return spouses[0];
        }

        return fsApi.getPreferredSpouse(personId).then(function (response) {
          if (response !== null) {
            var couple = _.find(theFamily.personWithRelationships.getSpouseRelationships(), function (it) {
              return it.id === response;
            });
            if (couple) {
              theFamily.spouse = theFamily.personWithRelationships.getPerson(couple.$getSpouseId(personId));
              return theFamily.spouse;
            }
          }
          if (spouses.length) {
            theFamily.spouse = spouses[0];
            return spouses[0];
          }
        });
      },

      initAncestry: function() {
        var theFamily = this;
        var personId = theFamily.personWithRelationships.getPrimaryPerson().id;
        return fsApi.getAncestry(personId, {generations:3, spouse: theFamily.spouse?theFamily.spouse.id:null }).then(function(response){
          theFamily.ancestry = response;
          theFamily.initParentFamilies();
          return theFamily.ancestry;
        });
      },

      initParentFamilies: function() {
        var theFamily = this;

        function buildFamily(ancestryNumber, ancestorForReferenceNumber ) {
          var result = new FamilyConstructor();
          var father = theFamily.ancestry.getPerson(ancestryNumber);
          var mother = theFamily.ancestry.getPerson(ancestryNumber+1);
          var referenceId = theFamily.ancestry.getPerson(ancestorForReferenceNumber) ? theFamily.ancestry.getPerson(ancestorForReferenceNumber).id : null;
          result.person = father;
          result.spouse = mother;
          result.referenceId = referenceId;
          return result;
        }

        theFamily.cachedFamilyOfHusbandsParents = buildFamily(4,2);
        theFamily.cachedFamilyOfWifesParents = buildFamily(6,3);

        theFamily.cachedFamilyOfHusbandsParents.cachedFamilyOfHusbandsParents = buildFamily(8,4);
        theFamily.cachedFamilyOfHusbandsParents.cachedFamilyOfWifesParents = buildFamily(10,5);

        theFamily.cachedFamilyOfWifesParents.cachedFamilyOfHusbandsParents = buildFamily(12,6);
        theFamily.cachedFamilyOfWifesParents.cachedFamilyOfWifesParents = buildFamily(14,7);
      },

      initHoverData: function() {
        var theFamily = this;

        if ( theFamily.getPerson() && !theFamily.personWithRelationships && !theFamily.didPersonAlternates ) {
          fsApi.getPersonWithRelationships(theFamily.getPerson().id, {persons: true}).then(function(response) {
            theFamily.personWithRelationships = response;
          });
        }

        if ( theFamily.getSpouse() && !theFamily.spouseWithRelationships && !theFamily.didSpouseAlternates ) {
          fsApi.getPersonWithRelationships(theFamily.getSpouse().id, {persons: true}).then(function(response) {
            theFamily.spouseWithRelationships = response;
          });
        }
      },

      build: function(person,spouse,referenceId) {
        var result = new FamilyConstructor();
        console.log(referenceId);
//        result.initializationPromise = setPersonAndSpouse(result,person,spouse,referenceId);
        return result;
      },

      getPerson: function() {
        return this.person;
      },

      getSpouse: function() {
        return this.spouse;
      },

      primaryPersonIsHusband: function() {
        if ( this.getPerson() && this.getPerson()._isMale() ) {
          return true;
        }

        if ( this.getSpouse() ) {
          return !this.getSpouse()._isMale();
        }

        return false;
      },

      primaryPersonIsWife: function() {
        return this.getPerson() && !this.getPerson()._isMale();
      },

      spouseIsHusband: function() {
        return this.getSpouse() && this.getSpouse()._isMale();
      },

      spouseIsWife: function() {
        return this.getSpouse() && !this.getSpouse()._isMale();
      },


      // ------------------------------------
      // Husband stuff
      // ------------------------------------
      hasHusband: function() {
        return this.primaryPersonIsHusband() || this.spouseIsHusband();
      },

      getHusband: function() {
        return this.primaryPersonIsHusband() ? this.getPerson() : this.getSpouse();
      },

      getHusbandWithRelationships: function() {
        return this.primaryPersonIsHusband() ? this.personWithRelationships : this.spouseWithRelationships;
      },

      getHusbandName: function() {
        return this.getHusband() ? this.getHusband().$getPreferredName().$getFullText() : '';
      },

      parentFamilyOfHusband: function() {
        return this.cachedFamilyOfHusbandsParents;
      },

      hasAlternateHusbands: function() {
        return this.alternateHusbands().length > 1;
      },

      alternateHusbands: function() {
        if ( !_.isUndefined(this.cachedAlternateHusbands) ) {
          return this.cachedAlternateHusbands;
        }

        if ( !this.getWifeWithRelationships() ) {
          return [];
        }

        this.cachedAlternateHusbands = this.getWifeWithRelationships().getSpouses();
        return this.cachedAlternateHusbands;
      },

      alternatePaternalParents: function() {
        if (!_.isUndefined(this.cachedAlternatePaternalParents) ) {
          return this.cachedAlternatePaternalParents;
        }
        if ( !this.getHusbandWithRelationships() ) {
          return [];
        }

        var husbandRelationships = this.getHusbandWithRelationships();
        this.cachedAlternatePaternalParents = _.toArray(
          _.map(husbandRelationships.getParentRelationships(),function(onePairOfParents){
            return {
              father:  onePairOfParents.$getFatherId() ? husbandRelationships.getPerson( onePairOfParents.$getFatherId() ) : null,
              mother: onePairOfParents.$getMotherId() ? husbandRelationships.getPerson( onePairOfParents.$getMotherId() ) : null
            };
          })
        );
        return this.cachedAlternatePaternalParents;
      },

      hasAlternatePaternalParents: function() {
        return this.alternatePaternalParents().length > 1 ;
      },

      // ------------------------------------
      // Wife stuff
      // ------------------------------------
      hasWife: function() {
        return this.primaryPersonIsWife() || this.spouseIsWife();
      },

      getWife: function() {
        return this.primaryPersonIsWife() ? this.getPerson() : this.getSpouse();
      },


      getWifeWithRelationships: function() {
        return this.primaryPersonIsWife() ? this.personWithRelationships : this.spouseWithRelationships;
      },

      getWifeName: function() {
        return this.getWife() ? this.getWife().$getPreferredName().$getFullText() : '';
      },

      parentFamilyOfWife: function() {
        return this.cachedFamilyOfWifesParents;
      },

      hasAlternateWives: function() {
        return this.alternateWives().length > 1;
      },

      alternateWives: function() {
        if ( !_.isUndefined(this.cachedAlternateWives) ) {
          return this.cachedAlternateWives;
        }

        if ( !this.getHusbandWithRelationships() ) {
          return [];
        }

        this.cachedAlternateWives = this.getHusbandWithRelationships().getSpouses();
        return this.cachedAlternateWives;
      },


      hasAlternateMaternalParents: function() {
        return this.alternateMaternalParents().length > 1 ;
      },

      alternateMaternalParents: function() {
        if (!_.isUndefined(this.cachedAlternateMaternalParents) ) {
          return this.cachedAlternateMaternalParents;
        }
        if ( !this.getWifeWithRelationships() ) {
          return [];
        }

        var wifeRelationships = this.getWifeWithRelationships();
        this.cachedAlternateMaternalParents = _.toArray(
          _.map(wifeRelationships.getParentRelationships(),function(onePairOfParents){
            return {
              father:  onePairOfParents.$getFatherId() ? wifeRelationships.getPerson( onePairOfParents.$getFatherId() ) : null,
              mother: onePairOfParents.$getMotherId() ? wifeRelationships.getPerson( onePairOfParents.$getMotherId() ) : null
            };
          })
        );
        return this.cachedAlternateMaternalParents;
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



      children: function() {
        if ( true ) {
          return [];
        }
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
        if ( !this.hasChildren() || this.childFamiliesInProgress ) {
          return [];
        }


        var that = this;
        var result = _.map(this.children(),function(child){
          return FamilyConstructor.prototype.build(child);
        });
        if ( !this.childFamiliesInProgress ) {
          this.childFamiliesInProgress = true;
          $q.all(_.map(result,function(it){ return it.initializationPromise;})).then(function(){
            that.cachedChildFamilies = result;
          });
        }
        return [];
      },


      hasChildren: function() {
        if ( !this.personWithRelationships ) {
          return false;
        }

        if ( !this.getSpouse() ) {
          return this.personWithRelationships.getChildRelationshipsOf(null).length > 0;
        }

        return this.personWithRelationships.getChildRelationshipsOf(this.getSpouse().id).length>0;
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