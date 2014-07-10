(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .constant('fsVitalFactTypes', [
      {type: 'http://gedcomx.org/Birth', hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/Christening', hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/Death', hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/Burial', hasDate: true, hasPlace: true}
    ]);
})();
