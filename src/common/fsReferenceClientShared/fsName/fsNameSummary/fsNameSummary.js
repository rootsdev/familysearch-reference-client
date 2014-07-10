(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsNameSummary', function(fsNameUtils) {
      return {
        templateUrl: 'fsReferenceClientShared/fsName/fsNameSummary/fsNameSummary.tpl.html',
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
