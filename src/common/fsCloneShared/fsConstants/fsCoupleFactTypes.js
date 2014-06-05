(function(){
  'use strict';
  angular.module('fsCloneShared')
    .constant('fsCoupleFactTypes', [
      {type: 'http://gedcomx.org/Annulment', hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/CommonLawMarriage', hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/Divorce', hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/Marriage', hasDate: true, hasPlace: true}
    ]);
})();
