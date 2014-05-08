(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNameSummary', function() {
      return {
        templateUrl: 'fsCloneShared/fsName/fsNameSummary/fsNameSummary.tpl.html',
        scope: {
          item: '='
        },
        link: function(scope) {
          var map = {
            'http://gedcomx.org/AlsoKnownAs' : 'Also Known As'
          };
          scope.getAlternateNameType = function(item) {
            return map[item.type] ? map[item.type] : '';
          };
        }
      };
    });
})();
