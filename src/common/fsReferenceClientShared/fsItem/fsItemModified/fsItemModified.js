(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsItemModified', function(fsChangeHistoryModal) {
      return {
        templateUrl: 'fsReferenceClientShared/fsItem/fsItemModified/fsItemModified.tpl.html',
        scope: {
          person: '=',
          item: '=',
          agent: '=',
          showHistory: '@'
        },
        link: function(scope) {
          scope.showHistoryModal = function() {
            fsChangeHistoryModal.open({person: scope.person, item: scope.item});
          };

        }
      };
    });
})();