(function(){
  'use strict';
  angular.module('fsCloneShared')
    .constant('fsNameTypes', [
      'http://gedcomx.org/AlsoKnownAs',
      'http://gedcomx.org/BirthName',
      'http://gedcomx.org/Nickname',
      'http://gedcomx.org/MarriedName'
    ]);
})();
