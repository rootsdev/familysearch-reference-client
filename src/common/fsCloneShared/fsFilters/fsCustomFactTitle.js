(function(){
  'use strict';
  angular.module('fsCloneShared')
    .filter('fsCustomFactTitle', function() {
      return function (input) {
        return input && input.indexOf('data:,') === 0 ? decodeURI(input.substr(6)) : '';
      };
    });
})();
