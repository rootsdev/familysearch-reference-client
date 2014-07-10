(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsCoupleProfile', function () {
      return {
        templateUrl: 'fsReferenceClientShared/fsCoupleProfile/fsCoupleProfile.tpl.html',
        scope: {
          couple: '=',
          husband: '=',
          wife: '=',
          hidePopover: '@'
        }
      };
    });
})();