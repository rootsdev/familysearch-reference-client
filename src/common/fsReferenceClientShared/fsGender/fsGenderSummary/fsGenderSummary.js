(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsGenderSummary', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsGender/fsGenderSummary/fsGenderSummary.tpl.html',
        scope: {
          gender: '='
        },
        link: function() {
        }
      };
    });
})();
