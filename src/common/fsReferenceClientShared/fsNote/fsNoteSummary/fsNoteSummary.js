(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsNoteSummary', function() {
      return {
        templateUrl: 'fsReferenceClientShared/fsNote/fsNoteSummary/fsNoteSummary.tpl.html',
        scope: {
          note: '='
        }
      };
    });
})();