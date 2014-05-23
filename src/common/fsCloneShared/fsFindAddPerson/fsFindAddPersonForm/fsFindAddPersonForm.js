(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFindAddPersonForm', function(_) {
      return {
        templateUrl: 'fsCloneShared/fsFindAddPerson/fsFindAddPersonForm/fsFindAddPersonForm.tpl.html',
        scope: {
        },
        link: function(scope) {
          console.log('fsFindAddPersonForm');
          scope.tabs = { addPersonActive: false, findPersonActive: true, findPersonByIdActive: false };
          scope.genderOptions = [
            {label: 'Any', value: ''},
            {label: 'Male', value: 'male'},
            {label: 'Female', value: 'female'},
            {label: 'Unknown', value: 'unknown'}
          ];
          scope.eventOptions = [
            {label: '-- Select --', value: ''},
            {label: 'Birth', value: 'birth'},
            {label: 'Christening', value: 'christening'},
            {label: 'Marriage', value: 'marriage'},
            {label: 'Death', value: 'death'},
            {label: 'Burial', value: 'burial'}
          ];
          var exactMatchFields = [
            'lastName',
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
              gender: '',
              event: ''
            };
          }

          initForm();

          scope.find = function() {
            console.log('find');
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

          scope.clear = function() {
            initForm();
          };

          scope.cancel = function() {
            console.log('cancel');
            scope.$emit('cancel');
          };

          scope.find = function() {
            console.log('find');
            var query = _.omit(scope.form, [
              'id',
              'event',
              'rangeFrom',
              'rangeTo',
              'place'].concat(_.map(exactMatchFields, function(field) {
                return field+'MatchExactly';
              })));
            if (scope.form.event) {
              var eventType = scope.form.event;
              if (eventType === 'christening') {
                eventType = 'birth';
              }
              else if (eventType === 'burial') {
                eventType = 'death';
              }
              if (scope.form.rangeFrom) {
                query[eventType+'Date'] = scope.form.rangeFrom;
              }
              if (scope.form.place) {
                query[eventType+'Place'] = scope.form.place;
              }
            }
            exactMatchFields.forEach(function(field) {
              if (query[field] && !scope.form[field+'MatchExactly']) {
                query[field] = query[field] + '~';
              }
            });
            scope.$emit('search', query);
          };

          scope.findById = function() {
            console.log('findById');
            scope.$emit('search', {id: scope.form.id });
          };

        }
      };
    });
})();