(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsParentsProfile', function () {
      return {
        templateUrl: 'fsReferenceClientShared/fsParentsProfile/fsParentsProfile.tpl.html',
        scope: {
          parents: '=',
          child: '=',
          father: '=',
          mother: '=',
          hidePopover: '@'
        }
      };
    });
})();