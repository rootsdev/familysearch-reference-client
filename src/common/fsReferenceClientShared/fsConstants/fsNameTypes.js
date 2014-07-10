(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .constant('fsNameTypes', [
      'http://gedcomx.org/AlsoKnownAs',
      'http://gedcomx.org/BirthName',
      'http://gedcomx.org/Nickname',
      'http://gedcomx.org/MarriedName'
    ]);
})();
