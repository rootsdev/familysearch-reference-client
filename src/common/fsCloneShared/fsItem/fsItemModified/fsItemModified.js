(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItemModified', function(fsChangeHistoryModal) {
      return {
        templateUrl: 'fsCloneShared/fsItem/fsItemModified/fsItemModified.tpl.html',
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