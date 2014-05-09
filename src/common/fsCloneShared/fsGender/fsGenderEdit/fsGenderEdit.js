(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGenderEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsGender/fsGenderEdit/fsGenderEdit.tpl.html',
        scope: {
          gender: '=',
          save: '&'
        },
        link: function(scope) {
          scope.submit = function () {
            // TBD
          };
        }
      };
    });
})();