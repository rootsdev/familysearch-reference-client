(function(){
  'use strict';
  angular.module('fsCloneShared')
    .constant('fsVitalFactTypes', [
      'http://gedcomx.org/Birth',
      'http://gedcomx.org/Christening',
      'http://gedcomx.org/Death',
      'http://gedcomx.org/Burial'
    ]);
})();