(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourcesSection', function ($rootScope, fsUtils, fsSourceUtils,
                                             fsSourceDescriptionModal, fsSourceAttachmentsModal) {
      return {
        templateUrl: 'fsCloneShared/fsSourcesSection/fsSourcesSection.tpl.html',
        scope: {
          state: '=',
          sources: '=',
          person: '=', // pass in person or couple+husband+wife or parents+child+father+mother
          couple: '=',
          husband: '=',
          wife: '=',
          parents: '=',
          child: '=',
          father: '=',
          mother: '='
        },
        link: function(scope) {

          scope.isLiving = function() {
            return !!scope.person && scope.person.living;
          };

          function detachSource(context) {
            var source = fsUtils.findById(scope.sources, context.sourceRef.id);
            if (!!source) {
              source._busy = true;
            }
            fsSourceUtils.detachSource(context).then(function() {
              _.remove(scope.sources, {id: context.sourceRef.id});
              $rootScope.$emit('deleted', context.sourceRef);
            }, function() {
              if (!!source) {
                source._busy = false;
              }
            });
          }

          function showSourceDescriptionModal(description, isEditing) {
            fsSourceDescriptionModal.open(description, isEditing).then(function(action) {
              if (action === 'delete') {
                fsSourceUtils.deleteSource(description).then(function() {
                  _.remove(scope.sources, function(source) {
                    return source.description.id === description.id;
                  });
                  $rootScope.$emit('deleted', description);
                });
              }
              else if (action === 'showAttachments') {
                fsSourceAttachmentsModal.open(description).then(function(sourceRefToDetach) {
                  if (!!sourceRefToDetach) {
                    fsSourceUtils.detachSource(sourceRefToDetach);
                  }
                });
              }
            });
          }

          // view
          scope.$on('view', function(event, description) {
            event.stopPropagation();
            showSourceDescriptionModal(description, false);
          });

          // edit
          scope.$on('edit', function(event, description) {
            event.stopPropagation();
            showSourceDescriptionModal(description, true);
          });

          // add
          scope.$on('add', function(event) {
            event.stopPropagation();
            scope.busy = true;
            fsSourceUtils.createSource().then(function (description) {
              fsSourceUtils.attachSource(description, {
                person: scope.person,
                couple: scope.couple,
                husband: scope.husband,
                wife: scope.wife,
                parents: scope.parents,
                child: scope.child,
                father: scope.father,
                mother: scope.mother
              }).then(function (sourceRef) {
                var source = {
                  ref: sourceRef,
                  description: description,
                  id: sourceRef.id
                };
                fsUtils.mixinStateFunctions(scope, source);
                scope.sources.push(source);
                scope.busy = false;
              }, function () {
                scope.busy = false;
              });
            }, function () {
              scope.busy = false;
            });
          });

          // delete (detach)
          scope.$on('delete', function(event, sourceRef) {
            event.stopPropagation();
            detachSource({
              person: scope.person,
              husband: scope.husband,
              wife: scope.wife,
              child: scope.child,
              father: scope.father,
              mother: scope.mother,
              sourceRef: sourceRef
            });
          });

          // attach from source box
          scope.$on('attach', function(event) {
            event.stopPropagation();
            scope.$emit('navigate', 'source-box', fsUtils.removeEmptyProperties({
              personId: scope.person ? scope.person.id : null,
              coupleId: scope.couple ? scope.couple.id : null,
              parentsId: scope.parents ? scope.parents.id : null
            }));
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