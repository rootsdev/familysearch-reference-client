(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFamilyMembersAddSpouse', function () {
      return {
        templateUrl: 'fsCloneShared/fsFamilyMembers/fsFamilyMembersAddSpouse/fsFamilyMembersAddSpouse.tpl.html',
        scope: {
          gender: '@'
        }
      };
    });
})();