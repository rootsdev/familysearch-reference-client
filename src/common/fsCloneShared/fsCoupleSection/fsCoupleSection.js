(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsCoupleSection', function (_, $rootScope, fsUtils) {
      return {
        templateUrl: 'fsCloneShared/fsCoupleSection/fsCoupleSection.tpl.html',
        scope: {
          state: '=',
          couple: '=',
          husband: '=',
          wife: '='
        },
        link: function(scope) {
          // init
          scope.members = [ scope.husband, scope.wife ];
          _.forEach(scope.members, function(member) {
            fsUtils.mixinStateFunctions(scope, member);
          });


          scope.getRole = function(index) {
            return index === 0 ? 'Husband' : 'Wife';
          };

          // save
          scope.$on('save', function(event, item, changeMessage) {
            event.stopPropagation();
            item._busy = true;
            if (!item.id) {
              scope.couple.$addFact(item);
            }
            item.$setChangeMessage(changeMessage);
            scope.couple.$save(null, true).then(function() {
              item._open();
              $rootScope.$emit('saved', item);
            });
          });

        }
      };
    });
})();