(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactEdit', function() {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFactEdit/fsFactEdit.tpl.html',
        scope: {
          fact: '=',
          agent: '=',
          save: '&'
        },
        link: function(scope) {
          scope.form = {
            date: scope.fact ? scope.fact.$getDate() : '',
            place: scope.fact ? scope.fact.$getPlace() : ''
          };

          scope.submit = function () {
            // TBD
          };
        }
      };
    });
})();