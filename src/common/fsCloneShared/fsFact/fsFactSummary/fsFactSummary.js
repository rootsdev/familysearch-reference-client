(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactSummary', function() {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFactSummary/fsFactSummary.tpl.html',
        scope: {
          item: '='
        },
        link: function(scope) {
          scope.getCustomFactTitle = function (item) {
            return item.type && item.type.indexOf('data:,') === 0 ? decodeURI(item.type.substr(6)) : '';
          };
        }
      };
    });
})();