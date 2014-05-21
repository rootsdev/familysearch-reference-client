(function() {
  'use strict';

  angular.module('fsCloneShared').factory('Family', function(_,fsApi, $q) {

    function coerceThing2PersonID(thing) {
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

      var personID = coerceThing2PersonID(person);

      return fsApi.getPersonWithRelationships(personID, {persons: true}).then(function(response) {
        personDescription.relationships = response;
        personDescription.person = response.getPrimaryPerson();

        return fsApi.getPreferredSpouse(personID).then(function(response) {
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
      preferredParents: null,
      defaultSpouse: null,
      person: null,

      displayName: function() {
        var result = this.person.$getPreferredName();
        if ( !_.isString(result)) {
          result = result.$getFullText();
        }
        return result;
      }
    };


    function FamilyConstructor(person, spouse) {
      var that = this;

      function initHusbandAndWife() {
        if ( that.personDescription && that.personDescription.person && that.personDescription.person._isMale() ) {
          that.husbandDescription = that.personDescription;
          that.wifeDescription = that.spouseDescription;
        } else {
          that.husbandDescription = that.spouseDescription;
          that.wifeDescription = that.personDescription;
        }
      }


      this.personDescription = new PersonDescription(person);
      if ( !_.isUndefined(spouse) ) {
        this.spouseDescription = new PersonDescription(spouse);
        $q.all([this.personDescription.initializationPromise, this.spouseDescription.initializationPromise]).then(function(){
          initHusbandAndWife();
        });
      } else {
        this.personDescription.initializationPromise.then(function(){
          that.spouseDescription = new PersonDescription(that.personDescription.defaultSpouse);
          that.spouseDescription.initializationPromise.then(function(){
            initHusbandAndWife();
          });
        });
      }
    }

    FamilyConstructor.prototype = {
      nameOf: function(description) {
        if ( description && description.person ) {
          var result = description.person.$getPreferredName();
          if ( !_.isString(result) ) {
            result = result.$getFullText();
          }
          return result;
        }
      },
      hasHusband: function() { return !!this.husbandDescription; },
      hasWife: function() { return !!this.wifeDescription; },
      husbandDescription: null,
      wifeDescription: null

    };


    return FamilyConstructor;
  });


})();