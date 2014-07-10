(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .constant('fsOtherFactTypes', [
      {type: 'http://gedcomx.org/Stillbirth', hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/BarMitzvah', hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/BatMitzvah', hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/MilitaryService', hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/Naturalization', hasValue: true, hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/Residence', hasValue: true, hasDate: true, hasPlace: true},
      {type: 'http://familysearch.org/v1/Affiliation', hasValue: true, hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/Religion', hasValue: true, hasDate: true, hasPlace: true},
      {type: 'http://familysearch.org/v1/TitleOfNobility', hasValue: true, hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/Occupation', hasValue: true, hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/Cremation', hasDate: true, hasPlace: true},
      {type: 'http://gedcomx.org/Caste', hasValue: true},
      {type: 'http://gedcomx.org/Clan', hasValue: true},
      {type: 'http://gedcomx.org/NationalId', hasValue: true},
      {type: 'http://gedcomx.org/Nationality', hasValue: true},
      {type: 'http://gedcomx.org/PhysicalDescription', hasValue: true},
      {type: 'http://gedcomx.org/Ethnicity', hasValue: true},
      {type: 'http://familysearch.org/v1/TribeName', hasValue: true}
    ]);
})();
