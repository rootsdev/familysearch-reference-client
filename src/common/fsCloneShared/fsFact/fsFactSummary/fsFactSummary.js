(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactSummary', function(fsDeathFactType) {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFactSummary/fsFactSummary.tpl.html',
        scope: {
          fact: '='
        },
        link: function(scope) {
          scope.getValue = function(fact) {
            if (fact.type === fsDeathFactType) {
              if (fact._living) {
                return 'Living';
              }
              else if (!!fact.id && !fact.$getDate() && !fact.$getPlace()) {
                return 'Deceased';
              }
              return '';
            }
            else {
              return fact.value;
            }
          };

        }
      };
    });
})();