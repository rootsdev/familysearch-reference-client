(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsFactSummary', function(fsDeathFactType, fsParentFactTypes) {
      return {
        templateUrl: 'fsReferenceClientShared/fsFact/fsFactSummary/fsFactSummary.tpl.html',
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

          scope.isLinkLabel = function(fact) {
            return _.any(fsParentFactTypes, {type: fact.type});
          };

        }
      };
    });
})();