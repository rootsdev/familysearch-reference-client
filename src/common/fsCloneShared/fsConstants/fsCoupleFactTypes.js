(function(){
  'use strict';
  angular.module('fsCloneShared')
    .constant('fsCoupleFactTypes', [
      {type: 'http://gedcomx.org/Annulment', hasDatePlace: true},
      {type: 'http://gedcomx.org/CommonLawMarriage', hasDatePlace: true},
      {type: 'http://gedcomx.org/Divorce', hasDatePlace: true},
      {type: 'http://gedcomx.org/Marriage', hasDatePlace: true}
    ]);
})();
