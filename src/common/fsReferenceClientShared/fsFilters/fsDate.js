(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .filter('fsDate', function() {
      var BAD_DATE = /^\d{6,8}$/;

      return function (fact) {
        if (!fact) {
          return '';
        }
        // some dates are stored as YYYYMMDD in the database; display the normalized version of those dates
        else if (BAD_DATE.test(fact.$getDate())) {
          return fact.$getNormalizedDate();
        }
        return fact.$getDate();
      };
    });
})();