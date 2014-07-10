(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsFactEdit', function(_, $filter, $q, fsApi, fsDeathFactType, fsVitalFactTypes,
                                      fsOtherFactTypes, fsCoupleFactTypes, fsParentFactTypes, fsUtils) {
      return {
        templateUrl: 'fsReferenceClientShared/fsFact/fsFactEdit/fsFactEdit.tpl.html',
        scope: {
          fact: '=',
          agent: '=',
          hideModified: '@',
          hideButtons: '@',
          hideReason: '@'
        },
        link: function(scope) {
          var oldDate, oldPlace;
          var allFactTypes = fsVitalFactTypes
            .concat(fsOtherFactTypes)
            .concat(fsCoupleFactTypes)
            .concat(fsParentFactTypes);
          scope.parentFactTypes = fsParentFactTypes;

          function initForm() {
            scope.form = {
              living: scope.fact._living === true ? 'true' : (scope.fact._living === false ? 'false' : ''),
              type: scope.fact.type,
              title: $filter('fsCustomFactTitle')(scope.fact.type),
              value: scope.fact.value,
              date: $filter('fsDate')(scope.fact),
              stdDate: scope.fact.$getNormalizedDate(),
              formalDate: scope.fact.$getFormalDate(),
              place: scope.fact.$getPlace(),
              stdPlace: scope.fact.$getNormalizedPlace(),
              reason: !!scope.form ? scope.form.reason : ''
            };
            oldDate = scope.form.date;
            oldPlace = scope.form.place;
          }

          initForm();

          function getFactType(type) {
            return _.find(allFactTypes, { type: type });
          }

          scope.isCustomFactType = function(type) {
            return !getFactType(type);
          };

          scope.isParentFactType = function(type) {
            return _.any(fsParentFactTypes, { type: type });
          };

          scope.hasValue = function(type) {
            var factType = getFactType(type);
            return factType ? factType.hasValue : true;
          };

          scope.hasDate = function(type) {
            var factType = getFactType(type);
            return factType ? factType.hasDate : true;
          };

          scope.hasPlace = function(type) {
            var factType = getFactType(type);
            return factType ? factType.hasPlace : true;
          };

          scope.isDeathFactType = function(type) {
            return type === fsDeathFactType;
          };

          // fact data may change in fsFindAddPersonForm
          scope.$watch(function() {
            return scope.fact;
          }, function() {
            initForm();
          }, true);

          scope.getStdDates = function(val) {
            return fsApi.getDate(val).then(function(response) {
              var date = response.getDate();
              return date.valid ? [ date.normalized ] : [];
            });
          };

          scope.setStdDate = function() {
            if (!scope.form.date) {
              scope.form.stdDate = '';
              scope.form.formalDate = '';
              oldDate = scope.form.date;
              return $q.when(null);
            }
            else if (oldDate === scope.form.date && !!scope.form.stdDate) {
              return $q.when(null);
            }
            else {
              return fsApi.getDate(scope.form.date).then(function(response) {
                var date = response.getDate();
                scope.form.stdDate = date.valid ? date.normalized : '';
                scope.form.formalDate = date.valid ? date.$getFormalDate() : '';
                oldDate = scope.form.date;
              });
            }
          };

          scope.getStdPlaces = function(val) {
            return fsApi.getPlaceSearch(val).then(function(response) {
              return _.map(response.getPlaces(), function(place) {
                return place.$getNormalizedPlace();
              });
            });
          };

          scope.setStdPlace = function() {
            if (!scope.form.place) {
              scope.form.stdPlace = '';
              oldPlace = scope.form.place;
              return $q.when(null);
            }
            else if (oldPlace === scope.form.place && !!scope.form.stdPlace) {
              return $q.when(null);
            }
            else {
              return fsApi.getPlaceSearch(scope.form.place).then(function(response) {
                var places = response.getPlaces();
                scope.form.stdPlace = places.length > 0 ? places[0].$getNormalizedPlace() : '';
                oldPlace = scope.form.place;
              });
            }
          };

          // save the form to the fact
          scope.$on('save', function(event) { // ignore item parameter so we can respond to broadcasted save in fsFindAddPersonForm
            if (event.stopPropagation) {
              event.stopPropagation();
            }
            if (scope.isDeathFactType(scope.form.type) && scope.form.living === 'true') {
              if (!scope.fact._living) {
                scope.$parent.$emit('delete', scope.fact, scope.form.reason);
              }
            }
            else {
              $q.all([scope.setStdDate(), scope.setStdPlace()]).then(function() { // in case blur hasn't fired
                scope.fact
                  .$setDate(scope.form.date)
                  .$setNormalizedDate(scope.form.stdDate)
                  .$setFormalDate(scope.form.formalDate)
                  .$setPlace(scope.form.place)
                  .$setNormalizedPlace(scope.form.stdPlace);
                if (scope.isCustomFactType(scope.form.type)) {
                  scope.fact.type = fsUtils.encodeCustomFactType(scope.form.title);
                }
                if (scope.isParentFactType(scope.form.type)) {
                  scope.fact.type = scope.form.type;
                }
                if (scope.isDeathFactType(scope.form.type) && scope.form.living === 'false') {
                  scope.fact._living = false;
                }
                if (scope.form.value) {
                  scope.fact.value = scope.form.value;
                }
                else {
                  delete scope.fact.value;
                }
                scope.$parent.$emit('save', scope.fact, scope.form.reason);
              });
            }
          });

        }
      };
    });
})();