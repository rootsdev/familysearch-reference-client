(function () {
  'use strict';
  angular.module('fsReferenceClientShared')
    // generate urls or set $location
    .provider('fsLocation', function() {
      var locationFunctions;

      // locationFns = { // each function returns {prefix, path, search}
      //  getPersonLocation(personId)
      //  getCoupleLocation(coupleId)
      //  getParentsLocation(parentsId)
      //  getTreeLocation(personId)
      //  getFindAddLocation({husbandId,wifeId,fatherId,motherId,childIds,coupleId,parentsId,returnToPersonId,returnToCoupleId,returnToParentsId})
      //  getSourceBoxLocation({personId,coupleId,parentsId})
      // }
      this.configure = function(locationFns) {
        locationFunctions = locationFns;
      };

      this.$get = function($location) {
        function join(opts) {
          var keyValuePairs = [];
          for (var prop in opts) {
            if (opts.hasOwnProperty(prop)) {
              keyValuePairs.push(encodeURIComponent(prop)+'='+encodeURIComponent(opts[prop]));
            }
          }
          return keyValuePairs.join('&');
        }

        function getUrl(location) {
          var search = join(location.search);
          return encodeURI(location.prefix) + encodeURI(location.path) + (!!search ? '?'+search : '');
        }

        function setLocation(location) {
          $location.path(location.path);
          if (!!location.search) {
            $location.search(location.search);
          }
        }

        return {
          getPersonUrl: function(personId) {
            return getUrl(locationFunctions.getPersonLocation(personId));
          },
          setPersonLocation: function(personId) {
            setLocation(locationFunctions.getPersonLocation(personId));
          },
          getCoupleUrl: function(coupleId) {
            return getUrl(locationFunctions.getCoupleLocation(coupleId));
          },
          setCoupleLocation: function(coupleId) {
            setLocation(locationFunctions.getCoupleLocation(coupleId));
          },
          getParentsUrl: function(parentsId) {
            return getUrl(locationFunctions.getParentsLocation(parentsId));
          },
          setParentsLocation: function(parentsId) {
            setLocation(locationFunctions.getParentsLocation(parentsId));
          },
          getTreeUrl: function(personId,spouseId) {
            return getUrl(locationFunctions.getTreeLocation(personId,spouseId));
          },
          setTreeLocation: function(personId) {
            setLocation(locationFunctions.getTreeLocation(personId));
          },
          getFindAddUrl: function(opts) {
            return getUrl(locationFunctions.getFindAddLocation(opts));
          },
          setFindAddLocation: function(opts) {
            setLocation(locationFunctions.getFindAddLocation(opts));
          },
          getSourceBoxUrl: function(opts) {
            return getUrl(locationFunctions.getSourceBoxLocation(opts));
          },
          setSourceBoxLocation: function(opts) {
            setLocation(locationFunctions.getSourceBoxLocation(opts));
          }
        };
      };

    });
})();