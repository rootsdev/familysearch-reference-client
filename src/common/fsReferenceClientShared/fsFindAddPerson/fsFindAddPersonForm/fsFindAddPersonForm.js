(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsFindAddPersonForm', function(_, $q, $timeout, $filter, fsApi) {
      return {
        templateUrl: 'fsReferenceClientShared/fsFindAddPerson/fsFindAddPersonForm/fsFindAddPersonForm.tpl.html',
        scope: {
          gender: '@',
          defaultTab: '@'
        },
        link: function(scope) {
          scope.genderOptions = [
            {label: 'Any', value: '', gedcomx: ''},
            {label: 'Male', value: 'male', gedcomx: 'http://gedcomx.org/Male'},
            {label: 'Female', value: 'female', gedcomx: 'http://gedcomx.org/Female'},
            {label: 'Unknown', value: 'unknown', gedcomx: 'http://gedcomx.org/Unknown'}
          ];
          if (scope.gender) {
            scope.genderOptions = _.filter(scope.genderOptions, {value: scope.gender});
            scope.requiredGender = _.find(scope.genderOptions, {value: scope.gender}).gedcomx;
          }

          scope.eventOptions = [
            {label: '-- Select --', value: ''},
            {label: 'Birth', value: 'birth', gedcomx: 'http://gedcomx.org/Birth'},
            {label: 'Christening', value: 'christening', gedcomx: 'http://gedcomx.org/Christening'},
            {label: 'Marriage', value: 'marriage', gedcomx: 'http://gedcomx.org/Marriage'},
            {label: 'Death', value: 'death', gedcomx: 'http://gedcomx.org/Death'},
            {label: 'Burial', value: 'burial', gedcomx: 'http://gedcomx.org/Burial'}
          ];

          var exactMatchFields = [
            'surname',
            'givenName',
            'fatherSurname',
            'fatherGivenName',
            'motherSurname',
            'motherGivenName',
            'spouseSurname',
            'spouseGivenName',
            'place'
          ];

          function initForm() {
            scope.form = {
              gender: scope.gender || '',
              event: ''
            };
            scope.person = (new fsApi.Person())
              .$addName(new fsApi.Name({type: 'http://gedcomx.org/BirthName', preferred: true}))
              .$addFact(new fsApi.Fact({type: 'http://gedcomx.org/Birth'}))
              .$addFact(new fsApi.Fact({type: 'http://gedcomx.org/Death'}))
              .$setGender(scope.requiredGender || '');
            scope.missingRequiredFields = false;
          }

          initForm();

          // manage tabs
          scope.tabs = { addPersonActive: false, findPersonActive: false, findPersonByIdActive: false };
          var findPersonActive = false;
          var addPersonActive = false;

          function setActiveTab(defaultTab) {
            scope.tabs.addPersonActive = (defaultTab === 'add');
            scope.tabs.findPersonActive = (defaultTab === 'find');
            scope.tabs.findPersonByIdActive = (defaultTab === 'findById');
          }

          setActiveTab(scope.defaultTab);

          scope.$watch(function() {
            return scope.defaultTab;
          }, function() {
            setActiveTab(scope.defaultTab);
          });

          // when saving components, wait for them to respond before continuing
          var saveDeferred;
          var componentsSaved;

          function saveComponents() {
            componentsSaved = 0;
            saveDeferred = new $q.defer();
            scope.$broadcast('save');
            return saveDeferred.promise;
          }

          function componentSaved() {
            if (++componentsSaved === 4) {
              saveDeferred.resolve();
            }
          }

          // update person from form
          scope.selectAddPerson = function() {
            if (findPersonActive) {
              scope.person.$getPreferredName()
                .$setGivenName(scope.form.givenName)
                .$setSurname(scope.form.surname);
              scope.person.$setGender(_.find(scope.genderOptions, {value: scope.form.gender }).gedcomx || '');
              var eventOption = _.find(scope.eventOptions, {value: scope.form.event });
              if ((eventOption.value === 'birth' || eventOption.value === 'death') &&
                (scope.form.date || scope.form.place)) {
                var fact = scope.person.$getFact(eventOption.gedcomx);
                fact
                  .$setDate(scope.form.date)
                  .$setFormalDate('')
                  .$setNormalizedDate('')
                  .$setPlace(scope.form.place)
                  .$setNormalizedPlace('');
                if (eventOption.value === 'death') {
                  fact._living = false;
                }
              }
            }
            addPersonActive = true;
            findPersonActive = false;
          };

          // update form from person
          scope.selectFindPerson = function() {
            if (addPersonActive) {
              saveComponents().then(function() { // tell the name, gender, and fact components to save the form onto the person
                scope.form.givenName = scope.person.$getGivenName();
                scope.form.surname = scope.person.$getSurname();
                var gender = _.find(scope.genderOptions, { gedcomx: scope.person.gender.type });
                scope.form.gender = !!gender ? gender.value : '';
                var factFound = false;
                scope.eventOptions.forEach(function(eventOption) {
                  var fact = scope.person.$getFact(eventOption.gedcomx);
                  if (!!fact && !factFound && (!!fact.$getDate() || !!fact.$getPlace())) {
                    factFound = true;
                    scope.form.event = eventOption.value;
                    scope.form.date = $filter('fsDate')(fact);
                    scope.form.place = fact.$getPlace();
                  }
                });
              });
            }
            findPersonActive = true;
            addPersonActive = false;
          };

          scope.toggleAdvancedSearch = function() {
            scope.isAdvancedSearch = !scope.isAdvancedSearch;
          };

          function someNotMatchExactly() {
            return _.any(exactMatchFields, function(field) {
              return !scope.form[field+'MatchExactly'];
            });
          }

          scope.toggleMatchAllExactly = function() {
            var someNot = someNotMatchExactly();
            exactMatchFields.forEach(function(field) {
              scope.form[field+'MatchExactly'] = someNot;
            });
          };

          scope.updateMatchAllExactly = function() {
            if (someNotMatchExactly()) {
              scope.form.isMatchAllExactly = false;
            }
          };

          scope.getAddPersonGenderOptions = function() {
            return _.filter(scope.genderOptions, function(opt) { return !!opt.value; });
          };

          scope.clear = function() {
            initForm();
          };
          scope.$on('clear', function() {
            scope.clear();
          });

          scope.cancel = function() {
            scope.$emit('cancel');
          };

          scope.find = function() {
            var query = _.omit(scope.form, [
              'id',
              'event',
              'gender',
              'date',
              'place'].concat(_.map(exactMatchFields, function(field) {
                return field+'MatchExactly';
              })));
            // set gender
            if (scope.form.gender && scope.form.gender !== 'unknown') {
              query.gender = scope.form.gender;
            }
            // set event date and place
            if (scope.form.event) {
              var eventType = scope.form.event;
              if (eventType === 'christening') {
                eventType = 'birth';
              }
              else if (eventType === 'burial') {
                eventType = 'death';
              }
              if (scope.form.date) {
                query[eventType+'Date'] = scope.form.date;
              }
              if (scope.form.place) {
                query[eventType+'Place'] = scope.form.place;
              }
            }
            // set approximate match
            exactMatchFields.forEach(function(field) {
              if (query[field] && (!scope.isAdvancedSearch || !scope.form[field+'MatchExactly'])) {
                query[field] = query[field] + '~';
              }
            });
            // emit query
            scope.$emit('search', query);
          };

          scope.findPersonById = function() {
            scope.$emit('search', {id: scope.form.id });
          };

          scope.add = function() {
            scope.missingRequiredFields = false;
            saveComponents().then(function() { // tell the name, gender, and fact components to save the form onto the person
              if (!scope.person.$getPreferredName().$getFullText() ||
                  !scope.person.gender.type ||
                  _.isUndefined(scope.person.$getDeath()._living)) {
                scope.missingRequiredFields = true;
              }
              else {
                scope.$emit('add', scope.person);
              }
            });
          };

          // catch save events bubbling up from name, gender, and fact components and ignore them
          // after they have finished saving we'll emit match in the add function
          scope.$on('save', function(event) {
            if (event.stopPropagation) {
              event.stopPropagation();
              componentSaved();
            }
          });

          // catch death marked living and set living flag on death fact
          scope.$on('delete', function(event, fact) {
            event.stopPropagation();
            fact._living = true;
            componentSaved();
          });

        }
      };
    });
})();