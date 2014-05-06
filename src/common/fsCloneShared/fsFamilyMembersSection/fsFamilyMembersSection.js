(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFamilyMembersSection', function () {
      return {
        templateUrl: 'fsCloneShared/fsFamilyMembersSection/fsFamilyMembersSection.tpl.html',
        scope: {
          state: '='
        }
      };
    });
})();