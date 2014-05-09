(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNoteSummary', function() {
      return {
        templateUrl: 'fsCloneShared/fsNote/fsNoteSummary/fsNoteSummary.tpl.html',
        scope: {
          noteRef: '='
        }
      };
    });
})();