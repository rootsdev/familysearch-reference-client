(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourcesSection', function ($rootScope, fsDetachSourceConfirmationModal, fsCurrentUser, fsUtils) {
      return {
        templateUrl: 'fsCloneShared/fsSourcesSection/fsSourcesSection.tpl.html',
        scope: {
          state: '=',
          person: '=',
          sources: '='
        },
        link: function(scope) {

          // delete (detach)
          scope.$on('delete', function(event, sourceRef) {
            event.stopPropagation();
            fsDetachSourceConfirmationModal.open({
              person: scope.person,
              sourceRef: sourceRef
            }).then(function(changeMessage) {
              fsUtils.findById(scope.sources, sourceRef.id)._busy = true;
              sourceRef.$delete(changeMessage).then(function() {
                _.remove(scope.sources, {id: sourceRef.id});
                $rootScope.$emit('deleted', sourceRef);
              });
            });
          });

          // save (tags or justification)
          scope.$on('save', function(event, sourceRef) {
            event.stopPropagation();
            var source = fsUtils.findById(scope.sources, sourceRef.id);
            (sourceRef._editingJustification ? sourceRef : source)._busy = true;
            sourceRef.$save(sourceRef.attribution.changeMessage).then(function() {
              sourceRef._busy = false;
              source._busy = false;
              sourceRef._editingJustification = false;
              // we can't refresh sourceRefs unfortunately, so attempt to approximate new attribution
              fsUtils.approximateAttribution(sourceRef);
              $rootScope.$emit('saved', sourceRef);
            });
          });

        }
      };
    });
})();