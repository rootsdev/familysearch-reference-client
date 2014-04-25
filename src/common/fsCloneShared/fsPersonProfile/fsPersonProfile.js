(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsPersonProfile', function () {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'fsCloneShared/fsPersonProfile/fsPersonProfile.tpl.html'
      };
    });
})();