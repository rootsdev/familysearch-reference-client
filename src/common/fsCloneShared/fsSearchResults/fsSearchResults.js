(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSearchResults', function() {
      return {
        templateUrl: 'fsCloneShared/fsSearchResults/fsSearchResults.tpl.html',
        scope: {
          results: '=',
          context: '=',
          start: '='
        },
        link: function() {
          console.log('fsSearchResults');
        }
      };
    });
})();