(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNameEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsName/fsNameEdit/fsNameEdit.tpl.html',
        scope: {
          name: '=',
          agent: '='
        },
        link: function(scope) {
          scope.form = {
            prefix: scope.name.$getPrefix(),
            given: scope.name.$getGivenName(),
            surname: scope.name.$getSurname(),
            suffix: scope.name.$getSuffix()
          };

          function getFullText(form) {
            var pieces = [];
            if (form.prefix) {
              pieces.push(form.prefix);
            }
            if (form.given) {
              pieces.push(form.given);
            }
            if (form.surname) {
              pieces.push(form.surname);
            }
            if (form.suffix) {
              pieces.push(form.suffix);
            }
            return pieces.join(' ');
          }

          // save the form to the gender
          scope.$on('save', function(event, name) {
            event.stopPropagation();
            name
              .$setPrefix(scope.form.prefix)
              .$setGivenName(scope.form.given)
              .$setSurname(scope.form.surname)
              .$setSuffix(scope.form.suffix)
              .$setFullText(getFullText(scope.form));
            scope.$parent.$emit('save', name, scope.form.reason);
          });

        }
      };
    });
})();