(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGenderEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsGender/fsGenderEdit/fsGenderEdit.tpl.html',
        scope: {
          gender: '=',
          agent: '=',
          requiredGender: '@',
          hideModified: '@',
          hideButtons: '@',
          hideReason: '@'
        },
        link: function(scope) {
          // set the options
          scope.genderOptions = [
            {label: 'Male', value: 'http://gedcomx.org/Male'},
            {label: 'Female', value: 'http://gedcomx.org/Female'},
            {label: 'Unknown', value: 'http://gedcomx.org/Unknown'}
          ];
          if (!!scope.requiredGender) {
            scope.genderOptions = _.filter(scope.genderOptions, {value: scope.requiredGender});
          }

          // populate the form from the gender
          scope.$watch(function() {
            return scope.gender;
          }, function() {
            scope.form = {
              type: scope.gender.type
            };
          }, true);

          // save the form to the gender
          scope.$on('save', function(event) { // ignore item parameter so we can respond to broadcasted save in fsFindAddPersonForm
            if (event.stopPropagation) {
              event.stopPropagation();
            }
            scope.gender.type = scope.form.type;
            scope.$parent.$emit('save', scope.gender, scope.form.reason);
          });

        }
      };
    });
})();