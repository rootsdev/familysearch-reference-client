(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactEdit', function(_, $filter, $q, fsApi, fsDeathFactType, fsVitalFactTypes, fsOtherFactTypes, fsUtils) {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFactEdit/fsFactEdit.tpl.html',
        scope: {
          fact: '=',
          agent: '='
        },
        link: function(scope) {
          scope.form = {
            living: scope.fact._living ? 'true' : 'false',
            value: scope.fact.value,
            date: scope.fact.$getDate(),
            stdDate: scope.fact.$getNormalizedDate(),
            formalDate: scope.fact.$getFormalDate(),
            place: scope.fact.$getPlace(),
            stdPlace: scope.fact.$getNormalizedPlace()
          };

          if (_.contains(fsVitalFactTypes, scope.fact.type)) {
            scope.hasValue = false;
            scope.hasDatePlace = true;
          }
          else {
            var factType = _.find(fsOtherFactTypes, {type: scope.fact.type});
            if (!!factType) {
              scope.hasValue = factType.hasValue;
              scope.hasDatePlace = factType.hasDatePlace;
            }
            else {
              scope.isCustom = true;
              scope.form.title = $filter('fsCustomFactTitle')(scope.fact.type);
              scope.hasValue = true;
              scope.hasDatePlace = true;
            }
          }

          var oldDate = scope.form.date;
          var oldPlace = scope.fact.place;

          scope.isDeath = function(fact) {
            return fact.type === fsDeathFactType;
          };

          scope.getStdDates = function(val) {
            return fsApi.getDate(val).then(function(response) {
              var date = response.getDate();
              return date.valid ? [ date.normalized ] : [];
            });
          };

          scope.setStdDate = function() {
            if (oldDate === scope.form.date) {
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
            if (oldPlace === scope.form.place) {
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
          scope.$on('save', function(event, fact) {
            event.stopPropagation();
            if (scope.isDeath(fact) && scope.form.living === 'true') {
              if (!fact._living) {
                scope.$parent.$emit('delete', fact, scope.form.reason);
              }
            }
            else {
              $q.all([scope.setStdDate(), scope.setStdPlace()]).then(function() { // in case blur hasn't fired
                fact
                  .$setDate(scope.form.date)
                  .$setNormalizedDate(scope.form.stdDate)
                  .$setFormalDate(scope.form.formalDate)
                  .$setPlace(scope.form.place)
                  .$setNormalizedPlace(scope.form.stdPlace);
                if (scope.isCustom) {
                  fact.type = fsUtils.encodeCustomFactType(scope.form.title);
                }
                if (scope.form.value) {
                  fact.value = scope.form.value;
                }
                else {
                  delete fact.value;
                }
                scope.$parent.$emit('save', fact, scope.form.reason);
              });
            }
          });

        }
      };
    });
})();