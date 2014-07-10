(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .filter('fsCustomFactTitle', function() {
      return function (input) {
        return input && input.indexOf('data:,') === 0 ? decodeURI(input.substr(6)) : '';
      };
    });
})();
