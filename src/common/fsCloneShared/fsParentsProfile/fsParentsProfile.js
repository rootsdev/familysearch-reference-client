(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsParentsProfile', function () {
      return {
        templateUrl: 'fsCloneShared/fsParentsProfile/fsParentsProfile.tpl.html',
        scope: {
          child: '=',
          father: '=',
          mother: '='
        }
      };
    });
})();