(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsNameSummary', function(fsNameUtils) {
      return {
        templateUrl: 'fsCloneShared/fsName/fsNameSummary/fsNameSummary.tpl.html',
        scope: {
          name: '='
        },
        link: function(scope) {
          scope.nameFormOrderByFn =
            fsNameUtils.getNameFormOrderByFunction(fsNameUtils.getTemplate(fsNameUtils.getPrimaryLang(scope.name.nameForms)));
        }
      };
    });
})();
