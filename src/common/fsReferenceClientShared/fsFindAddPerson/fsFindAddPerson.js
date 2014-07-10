(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsFindAddPerson', function(_, $q, fsApi, fsUtils, fsConfirmationModal, fsLocation) {
      return {
        templateUrl: 'fsReferenceClientShared/fsFindAddPerson/fsFindAddPerson.tpl.html',
        scope: {
          // pass in a coupleId and a husbandId|wifeId to update the couple relationship with find/add person
          // pass in a husbandId|wifeId to create a couple relationship with husbandId|wifeId and find/add person
          // pass in a parentsId and a husbandId|wifeId to create a couple relationship with husbandId|wifeId and find/add person
          //   and update the child-and-parents relationship with find/add person as one of the parents
          // pass in a fatherId|motherId to create a child-and-parents relationship with find/add person as child
          // pass in a comma-separated list of childIds to create child-and-parents relationships with find/add person as only parent
          // pass in a comma-separated list of childIds and a husbandId|wifeId to create child-and-parents relationships
          //   with husbandId|wifeId and find/add person as parents as well as a couple relationship
          husbandId: '@',
          wifeId: '@',
          fatherId: '@',
          motherId: '@',
          childIds: '@',
          coupleId: '@',
          parentsId: '@',
          // pass in one of the following "returnTo" parameters to redirect to a person, couple, or parents view
          returnToPersonId: '@',
          returnToCoupleId: '@',
          returnToParentsId: '@'
        },
        link: function(scope) {
          scope.showResults = false;
          scope.pageSize = 20;
          scope.defaultFormTab = 'find';

          // restrict gender if find/add spouse
          if (scope.husbandId) {
            scope.gender = 'female';
          }
          else if (scope.wifeId) {
            scope.gender = 'male';
          }

          scope.$on('search', function(event, query) {
            event.stopPropagation();

            if (query.id) { // find by id
              fsApi.getPersonWithRelationships(query.id, {persons: true}).then(function(response) {
                scope.results = [{
                  $getPrimaryPerson: _.bind(response.getPrimaryPerson, response),
                  $getFatherIds: _.bind(response.getFatherIds, response),
                  $getFathers: _.bind(response.getFathers, response),
                  $getMotherIds: _.bind(response.getMotherIds, response),
                  $getMothers: _.bind(response.getMothers, response)
                }];
                scope.context = null;
                scope.count = 1;
                scope.start = 0;
                scope.showResults = true;
              }, function() {
                scope.results = [];
                scope.context = null;
                scope.count = 0;
                scope.start = 0;
                scope.showResults = true;
              });
            }
            else {
              fsApi.getPersonSearch(_.extend({count: scope.pageSize}, query)).then(function(response) {
                scope.results = response.getSearchResults();
                scope.context = response.getContext();
                scope.count = response.getResultsCount();
                scope.start = response.getIndex();
                scope.showResults = true;
              });
            }
          });

          scope.$on('refine', function(event, reset) {
            event.stopPropagation();
            if (reset) {
              scope.$broadcast('clear'); // tell form to re-init
            }
            scope.showResults = false;
          });

          function leave() {
            scope.busy = false;
            if (!!scope.returnToPersonId) {
              fsLocation.setPersonLocation(scope.returnToPersonId);
            }
            else if (!!scope.returnToCoupleId) {
              fsLocation.setCoupleLocation(scope.returnToCoupleId);
            }
            else if (!!scope.returnToParentsId) {
              fsLocation.setParentsLocation(scope.returnToParentsId);
            }
          }

          scope.$on('cancel', function(event) {
            event.stopPropagation();
            leave();
          });

          function addCoupleRelationship(person) {
            if (!!scope.coupleId) {
              // update existing couple relationship
              return fsConfirmationModal.open({
                title: 'Changing Spouse to ' + person.$getDisplayName(),
                subTitle: 'Reason This Relationship Is Correct',
                showChangeMessage: true,
                okLabel: 'Change'
              }).then(function(changeMessage) {
                // update existing couple relationship
                return fsApi.getCouple(scope.coupleId).then(function(response) {
                  return response.getRelationship()
                    .$setHusband(scope.husbandId || person.id)
                    .$setWife(scope.wifeId || person.id)
                    .$save(changeMessage);
                });
              });
            }
            else if (!!scope.husbandId || !!scope.wifeId) {
              // create couple relationship if one doesn't already exist
              return fsApi.getSpouses(scope.husbandId || scope.wifeId).then(function(response) {
                if (!_.any(response.getCoupleRelationships(), function(rel) {
                  return person.id === (scope.husbandId ? rel.$getWifeId() : rel.$getHusbandId());
                })) {
                  return (new fsApi.Couple({
                    husband: scope.husbandId || person.id,
                    wife: scope.wifeId || person.id
                  })).$save();
                }
                else {
                  return $q.when(null);
                }
              });
            }
            else {
              return $q.when(null);
            }
          }

          function addChildAndParentsRelationships(person) {
            var fatherId = !!scope.husbandId ? scope.husbandId :
              (person.gender.type === 'http://gedcomx.org/Male' ? person.id : null);
            var motherId = !!scope.wifeId ? scope.wifeId :
              (person.gender.type === 'http://gedcomx.org/Female' ? person.id : null);

            if (!!scope.parentsId) {
              // update the existing child-and-parents relationship
              return fsConfirmationModal.open({
                title: 'Changing Relationship',
                subTitle: 'Reason This Relationship Is Correct',
                showChangeMessage: true,
                okLabel: 'Change'
              }).then(function(changeMessage) {
                return fsApi.getChildAndParents(scope.parentsId).then(function(response) {
                  return response.getRelationship()
                    .$setFather(fatherId)
                    .$setMother(motherId)
                    .$save(changeMessage);
                });
              });
            }
            else if (!!scope.childIds) {
              // create child-and-parents relationships
              // I got a "deadlock detected" conflict doing this, so let's be slow and do them one at a time :-(
              // TODO check to see if we can do this in parallel someday
//              return $q.all(_.map(scope.childIds.split(','), function(childId) {
//                return (new fsApi.ChildAndParents(fsUtils.removeEmptyProperties({
//                  father: fatherId,
//                  mother: motherId,
//                  child: childId
//                }))).$save();
//              }));
              var childIds = scope.childIds.split(',');
              if (!!scope.husbandId || !!scope.wifeId) {
                // one of the parents exists; we need to update existing child-and-parents relationships
                return fsApi.getChildren(scope.husbandId || scope.wifeId).then(function(response) {
                  var caprs = response.getChildAndParentsRelationships();
                  return fsUtils.allPromisesSerially(childIds, function(childId) {
                    return _.find(caprs, function(capr) { return capr.$getChildId() === childId; })
                      .$setFather(fatherId)
                      .$setMother(motherId)
                      .$save();
                  });
                });
              }
              else {
                // no existing parents; add child-and-parents relationships
                return fsUtils.allPromisesSerially(childIds, function(childId) {
                  return (new fsApi.ChildAndParents(fsUtils.removeEmptyProperties({
                    father: fatherId,
                    mother: motherId,
                    child: childId
                  }))).$save();
                });
              }
            }
            else if (!!scope.fatherId || !!scope.motherId) {
              // create child-and-parents relationships
              return (new fsApi.ChildAndParents(fsUtils.removeEmptyProperties({
                father: scope.fatherId,
                mother: scope.motherId,
                child: person.id
              }))).$save();
            }
            else {
              return $q.when(null);
            }
          }

          function addRelationships(person) {
            scope.busy = true;
            // I got a "deadlock detected" conflict doing this, so let's be slow and do them one at a time :-(
            //return $q.all([addCoupleRelationship(person), addChildAndParentsRelationships(person)]);
            return addCoupleRelationship(person).then(function() {
              return addChildAndParentsRelationships(person);
            });
          }

          scope.$on('select', function(event, person) {
            event.stopPropagation();
            addRelationships(person).then(leave, leave); // leave even if user cancelled confirmation modal
          });

          function createPerson(person) {
            scope.busy = true;
            if (person.$getDeath()._living) {
              person.$deleteFact(person.$getDeath());
            }
            return person.$save(null, true);
          }

          scope.$on('add', function(event, person) {
            event.stopPropagation();
            if (!person) {
              // called from search results
              scope.showResults = false;
              scope.defaultFormTab = 'add';
            }
            else {
              // TODO sometimes the system runs a match - when does this happen?
              createPerson(person).then(function() {
                scope.$emit('select', person);
              });
            }
          });

        }
      };
    });
})();
