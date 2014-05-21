(function(){
  'use strict';
  angular.module('fsCloneShared')
    .constant('fsOtherFactTypes', [
      {type: 'http://gedcomx.org/Stillbirth', hasDatePlace: true},
      {type: 'http://gedcomx.org/BarMitzvah', hasDatePlace: true},
      {type: 'http://gedcomx.org/BatMitzvah', hasDatePlace: true},
      {type: 'http://gedcomx.org/MilitaryService', hasDatePlace: true},
      {type: 'http://gedcomx.org/Naturalization', hasValue: true, hasDatePlace: true},
      {type: 'http://gedcomx.org/Residence', hasValue: true, hasDatePlace: true},
      {type: 'http://familysearch.org/v1/Affiliation', hasValue: true, hasDatePlace: true},
      {type: 'http://gedcomx.org/Religion', hasValue: true, hasDatePlace: true},
      {type: 'http://familysearch.org/v1/TitleOfNobility', hasValue: true, hasDatePlace: true},
      {type: 'http://gedcomx.org/Occupation', hasValue: true, hasDatePlace: true},
      {type: 'http://gedcomx.org/Cremation', hasDatePlace: true},
      {type: 'http://gedcomx.org/Caste', hasValue: true},
      {type: 'http://gedcomx.org/Clan', hasValue: true},
      {type: 'http://gedcomx.org/NationalId', hasValue: true},
      {type: 'http://gedcomx.org/Nationality', hasValue: true},
      {type: 'http://gedcomx.org/PhysicalDescription', hasValue: true},
      {type: 'http://gedcomx.org/Ethnicity', hasValue: true},
      {type: 'http://familysearch.org/v1/TribeName', hasValue: true}
    ]);
})();
