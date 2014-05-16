(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourcesSection', function ($rootScope, fsItemHelpers, fsDetachSourceConfirmationModal, fsCurrentUser) {
      return {
        templateUrl: 'fsCloneShared/fsSourcesSection/fsSourcesSection.tpl.html',
        scope: {
          state: '=',
          person: '='
        },
        link: function(scope) {
          // read
          scope.sources = [];
          if (!scope.person.living) {
            scope.person.$getSourceRefs().then(function(response) {
              response.getSourceRefs().forEach(function(sourceRef) {
                var source = {
                  ref: sourceRef,
                  description: response.getSourceDescription(sourceRef.$sourceDescriptionId),
                  id: sourceRef.id
                };
                fsItemHelpers.mixinStateFunctions(scope, source);
                scope.sources.push(source);
              });
            });
          }

          // delete (detach)
          scope.$on('delete', function(event, sourceRef) {
            event.stopPropagation();
            fsDetachSourceConfirmationModal.open({
              person: scope.person,
              sourceRef: sourceRef
            }).then(function(changeMessage) {
              fsItemHelpers.findById(scope.sources, sourceRef.id)._busy = true;
              sourceRef.$delete(changeMessage).then(function() {
                _.remove(scope.sources, {id: sourceRef.id});
                $rootScope.$emit('deleted', sourceRef);
              });
            });
          });

          // save (tags or justification)
          scope.$on('save', function(event, sourceRef) {
            event.stopPropagation();
            var source = fsItemHelpers.findById(scope.sources, sourceRef.id);
            (sourceRef._editingJustification ? sourceRef : source)._busy = true;
            sourceRef.$save(sourceRef.attribution.changeMessage).then(function() {
              sourceRef._busy = false;
              source._busy = false;
              sourceRef._editingJustification = false;
              // we can't refresh sourceRefs unfortunately, so attempt to approximate new attribution
              fsCurrentUser.get().then(function(currentUser) {
                sourceRef.attribution.contributor = { resourceId: currentUser.treeUserId };
                sourceRef.attribution.modified = Date.now();
              });
              $rootScope.$emit('saved', sourceRef);
            });
          });

        }
      };
    });
})();