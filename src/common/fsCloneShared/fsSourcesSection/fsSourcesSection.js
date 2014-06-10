(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourcesSection', function ($rootScope, fsCurrentUser, fsUtils, fsApi,
                                             fsSourceDescriptionModal, fsCreateSourceModal, fsConfirmationModal,
                                             fsDetachSourceConfirmationModal, fsAttachSourceConfirmationModal) {
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

          function showSourceDescriptionModal(description, isEditing) {
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
                    _.remove(scope.sources, function(source) {
                      return source.description.id === description.id;
                    });
                    $rootScope.$emit('deleted', description);
                  });
                });
              }
              else if (action === 'showAttachments') {
                // TODO pop up show attachments modal
                console.log('show attachments');
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
            fsCreateSourceModal.open().then(function(form) {
              fsAttachSourceConfirmationModal.open({
                person: scope.person,
                husband: scope.husband,
                wife: scope.wife,
                child: scope.child,
                father: scope.father,
                mother: scope.mother
              }).then(function(response) { // {changeMessage, addToSourceBox}
                // create source
                var sourceDescription = new fsApi.SourceDescription(fsUtils.removeEmptyProperties({
                  about: form.url,
                  citation: form.citation,
                  title: form.title,
                  text: form.notes
                }));
                scope.busy = true;
                sourceDescription.$save(null, true).then(function() {
                  // create source ref
                  var sourceRef = new fsApi.SourceRef({
                    $personId: scope.person ? scope.person.id : '',
                    $coupleId: scope.couple ? scope.couple.id : '',
                    $childAndParentsId: scope.parents ? scope.parents.id : '',
                    sourceDescription: sourceDescription.id
                  });
                  sourceRef.$save(response.changeMessage).then(function (sourceRefId) {
                    // add source to sources
                    sourceRef.id = sourceRefId;
                    // we can't refresh sourceRefs unfortunately, so attempt to approximate new attribution
                    fsUtils.approximateAttribution(sourceRef);
                    var source = {
                      ref: sourceRef,
                      description: sourceDescription,
                      id: sourceRef.id
                    };
                    fsUtils.mixinStateFunctions(scope, source);
                    scope.sources.push(source);
                    scope.busy = false;
                    console.log('fsSourcesSection', scope.sources);
                  });
                  if (response.addToSourceBox) {
                    // TODO addToSourceBox
                    console.log('fsSourcesSection addToSourceBox');
                  }
                });
              });
            });
          });

          // delete (detach)
          scope.$on('delete', function(event, sourceRef) {
            event.stopPropagation();
            fsDetachSourceConfirmationModal.open({
              person: scope.person,
              husband: scope.husband,
              wife: scope.wife,
              child: scope.child,
              father: scope.father,
              mother: scope.mother,
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