(function() {
  'use strict';

  angular.module('fsReferenceClientShared').factory('Family', function(_,fsApi, $q, fsLocation) {
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

    function getExplicitAndImpliedSpouses(personWithRelationships) {
      var explicitSpouses = personWithRelationships.getSpouses();
      var personId = personWithRelationships.getPrimaryPerson().id;

      var allSpouses = _(personWithRelationships.getChildRelationships())
        .map(function(parentChildRelationship){
          return personWithRelationships.getPerson(
                    parentChildRelationship.$getFatherId()===personId ? parentChildRelationship.$getMotherId() : parentChildRelationship.$getFatherId()
          );
        })
        .reject(function(spouse) { return !spouse; })
        .union(explicitSpouses)
        .uniq('id')
        .valueOf();
      return allSpouses;
    }

    function FamilyConstructor(rootPerson, spouseId) {
      if ( rootPerson ) {
        var personId = coerce2PersonId(rootPerson);

        var theFamily = this;

        theFamily.readingAncestry = true;
        theFamily.readingDescendancy = true;

        var doneReadingAncestry =function(result) {
          theFamily.readingAncestry = false;
          return result;
        };

        var doneReadingDescendancy =function(result) {
          theFamily.readingDescendancy = false;
          return result;
        };

        this.initPerson(personId)
          .then(_.bind(this.initSpouse,this, spouseId))
          .then(_.bind(this.initAncestry,this) )
          .then(doneReadingAncestry,doneReadingAncestry)
          .then(_.bind(this.initDescendancy,this))
          .then(doneReadingDescendancy,doneReadingDescendancy);
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

      initSpouse: function(spouseId) {
        if ( spouseId==='unknown') {
          return $q.when(null);
        }

        var theFamily = this;
        var personId = theFamily.personWithRelationships.getPrimaryPerson().id;
        var spouses = getExplicitAndImpliedSpouses(theFamily.personWithRelationships);
        if (spouses && spouses.length === 1) {
          theFamily.spouse = spouses[0];
          return $q.when(spouses[0]);
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
        if ( theFamily.ancestry ) {
          return $q.when(theFamily.ancestry);
        }
        if ( !theFamily.getPerson() ) {
          return $q.when(null);
        }
        var personId = theFamily.getPerson().id;

        return fsApi.getAncestry(personId, {generations:4, spouse: theFamily.spouse?theFamily.spouse.id:null}).then(function(response){
          theFamily.ancestry = response;
          theFamily.initParentFamilies();
          return theFamily.ancestry;
        });
      },

      isReadingAncestry: function() {
        return this.readingAncestry === true;
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

        function buildParentFamilies(aFamily, ancestryNumber, recursionDepth) {
          aFamily.cachedFamilyOfHusbandsParents = buildFamily(ancestryNumber*2,ancestryNumber);
          aFamily.cachedFamilyOfWifesParents = buildFamily((ancestryNumber+1)*2,ancestryNumber+1);

          if ( recursionDepth>0 ) {
            buildParentFamilies(aFamily.cachedFamilyOfHusbandsParents, ancestryNumber*2, recursionDepth -1);
            buildParentFamilies(aFamily.cachedFamilyOfWifesParents, (ancestryNumber+1)*2, recursionDepth -1);

          }
        }

        buildParentFamilies(theFamily,2,2);
      },

      initDescendancy: function() {
        var theFamily = this;
        if ( theFamily.descendancy ) {
          return $q.when(theFamily.descendancy);
        }
        var personId = theFamily.personWithRelationships.getPrimaryPerson().id;
        var request = {generations:2, spouse: theFamily.spouse?theFamily.spouse.id:null};
        return fsApi.getDescendancy(personId, request).then(function(response){
          theFamily.descendancy = response;
          theFamily.initChildFamilies();
          return theFamily.descendancy;
        });
      },


      isReadingDescendancy: function() {
        return this.readingDescendancy === true;
      },

      initChildFamilies: function() {
        var theFamily = this;

        function familiesOf(parentId ) {
          var result = [];

          var childNumber = 1;
          while( theFamily.descendancy.exists(parentId+'.'+childNumber)) {
            var childId = parentId+'.'+childNumber;
            var aFamily = new FamilyConstructor();
            var person = theFamily.descendancy.getPerson(childId);
            var spouse = theFamily.descendancy.getPerson(childId+'-S');
            aFamily.person = person;
            aFamily.spouse = spouse;
            aFamily.descendancyNumber = childId;
            result.push(aFamily);
            childNumber = childNumber +1;
          }

          return result;
        }

        this.cachedChildFamilies = familiesOf('1');
        _.forEach(this.cachedChildFamilies,function(childFamily){
          childFamily.cachedChildFamilies = familiesOf(childFamily.descendancyNumber);
        });
      },

      initHoverData: function() {
        var theFamily = this;
        var promises = [];

        if ( theFamily.getPerson() && !theFamily.personWithRelationships && !theFamily.didPersonAlternates ) {
          promises.push(
            fsApi.getPersonWithRelationships(theFamily.getPerson().id, {persons: true}).then(function(response) {
              theFamily.personWithRelationships = response;
            })
          );
        }

        if ( theFamily.getSpouse() && !theFamily.spouseWithRelationships && !theFamily.didSpouseAlternates ) {
          promises.push(
            fsApi.getPersonWithRelationships(theFamily.getSpouse().id, {persons: true}).then(function(response) {
            theFamily.spouseWithRelationships = response;
            })
          );
        }

        $q.all(promises).then(function(){
          if ( !theFamily.personWithRelationships ) {
            return null;
          }
          theFamily.cachedChildren = theFamily.personWithRelationships.getChildrenOf( theFamily.spouse ? theFamily.spouse.id : null);
        });
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

      switchPaternalParents: function(newParents) {

        var theFamily = this;
        var father = newParents.father ? theFamily.getHusbandWithRelationships().getPerson(newParents.father.id) : null;
        var mother = newParents.mother ? theFamily.getHusbandWithRelationships().getPerson(newParents.mother.id) : null;

        var newFamily = new FamilyConstructor();
        if ( father ) {
          newFamily.person = father;
          newFamily.spouse = mother;
          newFamily.referenceId = theFamily.getHusband().id;
        } else {
          newFamily.person = mother;
          newFamily.spouse = father;
          newFamily.referenceId = theFamily.getHusband().id;
        }
        theFamily.readingAncestry = true;
        newFamily.initAncestry().then(function(){
          theFamily.cachedFamilyOfHusbandsParents = newFamily;
          theFamily.readingAncestry = false;
        });
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

      switchMaternalParents: function(newParents) {
        var theFamily = this;
        var father = newParents.father ? theFamily.getWifeWithRelationships().getPerson(newParents.father.id) : null;
        var mother = newParents.mother ? theFamily.getWifeWithRelationships().getPerson(newParents.mother.id) : null;

        var newFamily = new FamilyConstructor();
        if ( father ) {
          newFamily.person = father;
          newFamily.spouse = mother;
          newFamily.referenceId = theFamily.getWife().id;
        } else {
          newFamily.person = mother;
          newFamily.spouse = father;
          newFamily.referenceId = theFamily.getWife().id;
        }
        theFamily.readingAncestry = true;

        newFamily.initAncestry().then(function(){
          theFamily.cachedFamilyOfWifesParents = newFamily;
          theFamily.readingAncestry = false;
        });
      },

      // ------------------------------------
      // Children stuff
      // ------------------------------------
      hasChildren: function() {
        return this.children().length > 0;
      },

      hasChildrenWithUnknownMother: function() {
        return this.getHusbandWithRelationships() && this.getHusbandWithRelationships().getChildrenOf(null).length;
      },

      hrefForUnknownMother:  function() {
        return this.hasChildrenWithUnknownMother() ?
          fsLocation.getTreeUrl(this.getHusband().id,{spouseId:'unknown'})
          : '';
      },



      hasChildrenWithUnknownFather: function() {
        return this.getWifeWithRelationships() && this.getWifeWithRelationships().getChildrenOf(null).length;
      },

      hrefForUnknownFather:  function() {
        return this.hasChildrenWithUnknownFather() ?
          fsLocation.getTreeUrl(this.getWife().id,{spouseId:'unknown'})
          : '';
      },

      children: function() {
        if ( this.cachedChildren ) {
          return this.cachedChildren;
        }
        return [];
      },

      hasChildFamilies: function() {
        return this.childFamilies().length > 0;
      },

      childFamilies: function() {
        if ( this.cachedChildFamilies ) {
          return this.cachedChildFamilies;
        }
        return [];
      },

      isUseless: function() {
        return !this.person && !this.personWithRelationships && !this.spouse && !this.spouseWithRelationships && !this.referenceId;
      }

    };


    return FamilyConstructor;
  });


})();