(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactEdit', function(_, $filter, $q, fsApi, fsDeathFactType, fsVitalFactTypes, fsOtherFactTypes, fsUtils) {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFactEdit/fsFactEdit.tpl.html',
        scope: {
          fact: '=',
          agent: '=',
          hideModified: '@',
          hideButtons: '@',
          hideReason: '@'
        },
        link: function(scope) {

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

          // fact data may change in fsFindAddPersonForm
          var oldDate, oldPlace;
          scope.$watch(function() {
            return scope.fact;
          }, function() {
            scope.form = {
              living: scope.fact._living === true ? 'true' : (scope.fact._living === false ? 'false' : ''),
              value: scope.fact.value,
              date: scope.fact.$getDate(),
              stdDate: scope.fact.$getNormalizedDate(),
              formalDate: scope.fact.$getFormalDate(),
              place: scope.fact.$getPlace(),
              stdPlace: scope.fact.$getNormalizedPlace()
            };
            oldDate = scope.form.date;
            oldPlace = scope.form.place;
          }, true);

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
            if (scope.isDeath(scope.fact) && scope.form.living === 'true') {
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
                if (scope.isCustom) {
                  scope.fact.type = fsUtils.encodeCustomFactType(scope.form.title);
                }
                if (scope.isDeath(scope.fact) && scope.form.living === 'false') {
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