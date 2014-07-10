(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .constant('fsTagTypes', [
      'http://gedcomx.org/Name',
      'http://gedcomx.org/Gender',
      'http://gedcomx.org/Birth',
      'http://gedcomx.org/Christening',
      'http://gedcomx.org/Death',
      'http://gedcomx.org/Burial'
    ]);
})();