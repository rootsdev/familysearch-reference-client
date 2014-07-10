(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsCoupleSection', function (_, $rootScope, fsUtils, fsLocation) {
      return {
        templateUrl: 'fsReferenceClientShared/fsCoupleSection/fsCoupleSection.tpl.html',
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
          scope.$on('save', function(event, item) {
            event.stopPropagation();
            item._busy = true;
//            scope.couple.$save(null, true).then(function() {
              item._open();
              item._busy = false;
              $rootScope.$emit('saved', item);
//            });
          });

          // cancel save
          scope.$on('cancel', function(event, item) {
            event.stopPropagation();
            item._open();
          });

          // change
          scope.$on('change', function(event, member) {
            event.stopPropagation();
            fsLocation.setFindAddLocation(fsUtils.removeEmptyProperties({
              husbandId: member === scope.husband ? null : scope.husband.id,
              wifeId: member === scope.wife ? null : scope.wife.id,
              coupleId: scope.couple.id,
              returnToCoupleId: scope.couple.id
            }));
          });

        }
      };
    });
})();