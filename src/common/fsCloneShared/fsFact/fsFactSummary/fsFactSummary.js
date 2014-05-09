(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactSummary', function() {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFactSummary/fsFactSummary.tpl.html',
        scope: {
          fact: '='
        },
        link: function() {
        }
      };
    });
})();