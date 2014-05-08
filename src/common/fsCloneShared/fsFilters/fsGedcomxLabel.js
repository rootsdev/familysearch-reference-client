(function(){
  'use strict';
  angular.module('fsCloneShared')
    .filter('fsGedcomxLabel', function() {
      var map = {
        'AlsoKnownAs': 'Alternate Name',
        'BirthName': 'Name'
      };

      return function (input) {
        if (input) {
          if (input.indexOf('data:,') === 0) {
            input = 'Custom Fact';
          }
          else {
            var pos = input.lastIndexOf('/');
            if (pos) {
              input = input.substr(pos+1);
              if (map[input]) {
                input = map[input];
              }
            }
          }
        }
        return input;
      };
    });
})();