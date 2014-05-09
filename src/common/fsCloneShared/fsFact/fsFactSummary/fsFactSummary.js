(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactSummary', function() {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFactSummary/fsFactSummary.tpl.html',
        scope: {
          fact: '='
        },
        link: function(scope) {
          // TODO move this to a filter
          scope.getCustomFactTitle = function (fact) {
            return fact.type && fact.type.indexOf('data:,') === 0 ? decodeURI(fact.type.substr(6)) : '';
          };
        }
      };
    });
})();