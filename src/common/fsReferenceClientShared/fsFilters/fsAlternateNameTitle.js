// TODO no longer used
(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .filter('fsAlternateNameTitle', function() {
      var map = {
        'http://gedcomx.org/AlsoKnownAs' : 'Also Known As'
      };

      return function (input) {
        return map[input] ? map[input] : '';
      };
    });
})();
