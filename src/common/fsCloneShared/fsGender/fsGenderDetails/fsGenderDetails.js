(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsGenderDetails', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsGender/fsGenderDetails/fsGenderDetails.tpl.html',
        scope: {
          item: '='
        },
        link: function(scope, elem, attrs) {
        }
      };
    });
})();