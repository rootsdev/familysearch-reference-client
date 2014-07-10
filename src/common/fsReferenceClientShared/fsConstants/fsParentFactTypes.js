(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .constant('fsParentFactTypes', [
      {type: 'http://gedcomx.org/AdoptiveParent', hasDate: true},
      {type: 'http://gedcomx.org/BiologicalParent'},
      {type: 'http://gedcomx.org/GuardianParent', hasDate: true},
      {type: 'http://gedcomx.org/FosterParent', hasDate: true},
      {type: 'http://gedcomx.org/StepParent', hasDate: true}
    ]);
})();
