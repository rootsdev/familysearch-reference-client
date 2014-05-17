(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGenderEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsGender/fsGenderEdit/fsGenderEdit.tpl.html',
        scope: {
          gender: '=',
          agent: '='
        },
        link: function(scope) {
          // populate the form from the gender
          scope.$watch(function() {
            return scope.gender;
          }, function() {
            scope.form = {
              type: scope.gender.type
            };
          });

          // save the form to the gender
          scope.$on('save', function(event, gender) {
            event.stopPropagation();
            gender.type = scope.form.type;
            scope.$parent.$emit('save', gender, scope.form.reason);
          });

        }
      };
    });
})();