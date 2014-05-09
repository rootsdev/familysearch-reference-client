(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNameSummary', function() {
      return {
        templateUrl: 'fsCloneShared/fsName/fsNameSummary/fsNameSummary.tpl.html',
        scope: {
          name: '='
        },
        link: function(scope) {
          // TODO turn this into a filter
          var map = {
            'http://gedcomx.org/AlsoKnownAs' : 'Also Known As'
          };
          scope.getAlternateNameType = function(name) {
            return map[name.type] ? map[name.type] : '';
          };
        }
      };
    });
})();
