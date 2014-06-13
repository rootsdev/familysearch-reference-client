(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsSourceUtils', function ($q, $rootScope, fsApi, fsAgentCache, fsUtils, fsConfirmationModal,
                                        fsCreateSourceModal, fsDetachSourceConfirmationModal,
                                        fsSourceAttachmentsModal, fsSourceDescriptionModal) {

      function detachSource(context, sources) {
        fsDetachSourceConfirmationModal.open(context).then(function(changeMessage) {
          if (!!sources) {
            var source = fsUtils.findById(sources, context.sourceRef.id);
            if (!!source) {
              source._busy = true;
            }
          }
          context.sourceRef.$delete(changeMessage).then(function() {
            if (!!sources) {
              _.remove(sources, {id: context.sourceRef.id});
            }
            $rootScope.$emit('deleted', context.sourceRef);
          });
        });
      }

      function showSourceAttachmentsModal(description, sources) {
        fsSourceAttachmentsModal.open(description).then(function(sourceRefToDetach) {
          if (!!sourceRefToDetach) {
            detachSource(sourceRefToDetach, sources);
          }
        });
      }

      function showSourceDescriptionModal(description, isEditing, sources) {
        fsSourceDescriptionModal.open(description, isEditing).then(function(action) {
          if (action === 'delete') {
            fsConfirmationModal.open({
              title: 'Delete Source',
              subTitle: 'Are you sure that you want to delete this source? ' +
                'Not only will it be detached from all of the individuals that use it, but it will also be deleted from the system.',
              okLabel: 'Yes'
            }).then(function() {
              // delete source
              description.$delete().then(function() {
                if (!!sources) {
                  _.remove(sources, function(source) {
                    return source.description.id === description.id;
                  });
                }
                $rootScope.$emit('deleted', description);
              });
            });
          }
          else if (action === 'showAttachments') {
            showSourceAttachmentsModal(description, sources);
          }
        });
      }

      function createSource() {
        return fsCreateSourceModal.open().then(function(form) {
          var sourceDescription = new fsApi.SourceDescription(fsUtils.removeEmptyProperties({
            about: form.url,
            citation: form.citation,
            title: form.title,
            text: form.notes
          }));
          return sourceDescription.$save(null, true).then(function() {
            return sourceDescription;
          });
        });
      }

//      function attachSource(description, target) {
//
//      }
//
//      fsCreateSourceModal.open().then(function(form) {
//        fsAttachSourceConfirmationModal.open({
//          person: scope.person,
//          husband: scope.husband,
//          wife: scope.wife,
//          child: scope.child,
//          father: scope.father,
//          mother: scope.mother
//        }).then(function(changeMessage) {
//          // create source
//          scope.busy = true;
//          sourceDescription.$save(null, true).then(function() {
//            // create source ref
//            var sourceRef = new fsApi.SourceRef({
//              $personId: scope.person ? scope.person.id : '',
//              $coupleId: scope.couple ? scope.couple.id : '',
//              $childAndParentsId: scope.parents ? scope.parents.id : '',
//              sourceDescription: sourceDescription.id
//            });
//            sourceRef.$save(changeMessage).then(function (sourceRefId) {
//              // add source to sources
//              sourceRef.id = sourceRefId;
//              // we can't refresh sourceRefs unfortunately, so attempt to approximate new attribution
//              fsUtils.approximateAttribution(sourceRef);
//              var source = {
//                ref: sourceRef,
//                description: sourceDescription,
//                id: sourceRef.id
//              };
//              fsUtils.mixinStateFunctions(scope, source);
//              scope.sources.push(source);
//              scope.busy = false;
//              console.log('fsSourcesSection', scope.sources);
//            });
//          });
//        });
//      });

      return {
        detachSource: detachSource,

        showSourceAttachmentsModal: showSourceAttachmentsModal,

        showSourceDescriptionModal: showSourceDescriptionModal,

        createSource: createSource

//        attachSource: attachSource
      };
    });
})();