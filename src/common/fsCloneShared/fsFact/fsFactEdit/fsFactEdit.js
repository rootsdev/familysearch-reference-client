(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFactEdit/fsFactEdit.tpl.html',
        scope: {
          item: '=',
          type: '@',
          save: '&'
        },
        link: function(scope) {
          scope.submit = function () {
            // TBD
          };
        }
      };
    });
})();