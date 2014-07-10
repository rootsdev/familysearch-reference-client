(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .filter('fsGedcomxLabel', function() {
      var map = {
        'Stillbirth': 'Sillborn',
        'Ethnicity': 'Race',
        'NationalId': 'National Identity',
        'Nationality': 'National Origin',
        'CasteName': 'Caste',
        'ClanName': 'Clan',
        'CommonLawMarriage': 'Common Law',
        'AdoptiveParent': 'Adopted',
        'BiologicalParent': 'Biological',
        'GuardianParent': 'Guardianship',
        'FosterParent': 'Foster',
        'StepParent': 'Step'
      };

      return function (input) {
        if (!input || input.indexOf('data:,') === 0) {
          input = 'Custom Event';
        }
        else {
          var pos = input.lastIndexOf('/');
          if (pos) {
            input = input.substr(pos+1);
            if (map[input]) {
              input = map[input];
            }
            else {
              input = input.replace(/([A-Z])/g, ' $1').trim(); // CamelCase to Camel Case
            }
          }
        }
        return input;
      };
    });
})();