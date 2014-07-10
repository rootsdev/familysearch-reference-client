(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsItemSources', function(_, $q, $rootScope, fsApi, fsUtils) {
      return {
        templateUrl: 'fsReferenceClientShared/fsItem/fsItemSources/fsItemSources.tpl.html',
        scope: {
          item: '=',
          sources: '='
        },
        link: function(scope) {
          var tag = fsUtils.getItemTag(scope.item);

          scope.getSources = function() {
            return _.filter(scope.sources, function(source) {
              return _.contains(source.ref.$getTags(), tag);
            });
          };

          // save source refs
          scope.$on('save', function(event, sourceRefs) {
            event.stopPropagation();
            scope.item._busy = true;
            // argh - FamilySearch makes is submit the requests serially
            fsUtils.allPromisesSerially(sourceRefs, function(sourceRef) {
              return sourceRef.$save().then(function() {
                // we can't refresh sourceRefs after update so we have to approximate the attribution
                fsUtils.approximateAttribution(sourceRef);
              });
            }).then(function() {
              scope.item._busy = false;
              $rootScope.$emit('saved', sourceRefs);
            });
          });

        }
      };
    });
})();