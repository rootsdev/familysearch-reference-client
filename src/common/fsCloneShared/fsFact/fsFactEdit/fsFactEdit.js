(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFactEdit/fsFactEdit.tpl.html',
        scope: {
          item: '=',
          save: '&'
        },
        link: function(scope) {
          scope.form = {
            date: scope.item ? scope.item.$getDate() : '',
            place: scope.item ? scope.item.$getPlace() : ''
          };

          scope.submit = function () {
            // TBD
          };
        }
      };
    });
})();