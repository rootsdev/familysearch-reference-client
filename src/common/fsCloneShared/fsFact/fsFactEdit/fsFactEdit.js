(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsFactEdit', function(fsDeathFactType) {
      return {
        templateUrl: 'fsCloneShared/fsFact/fsFactEdit/fsFactEdit.tpl.html',
        scope: {
          fact: '=',
          agent: '=',
          save: '&'
        },
        link: function(scope) {
          scope.form = {
            living: scope.fact._living ? 'true' : 'false',
            date: scope.fact ? scope.fact.$getDate() : '',
            place: scope.fact ? scope.fact.$getPlace() : ''
          };

          scope.isDeath = function(fact) {
            return fact.type === fsDeathFactType;
          };

          scope.submit = function () {
            // TBD
          };
        }
      };
    });
})();