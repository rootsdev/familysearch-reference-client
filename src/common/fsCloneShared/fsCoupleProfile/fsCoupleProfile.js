(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsCoupleProfile', function () {
      return {
        templateUrl: 'fsCloneShared/fsCoupleProfile/fsCoupleProfile.tpl.html',
        scope: {
          couple: '=',
          husband: '=',
          wife: '='
        }
      };
    });
})();