(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsSourceBox', function($q, $rootScope, fsApi, fsCurrentUserCache, fsUtils, fsSourceUtils,
                                       fsLocation, fsFolderModal,
                                       fsConfirmationModal, fsSourceDescriptionModal, fsSourceAttachmentsModal) {
      return {
        templateUrl: 'fsReferenceClientShared/fsSourceBox/fsSourceBox.tpl.html',
        scope: {
          // pass in a personId, coupleId, or parentsId
          personId: '@',
          coupleId: '@',
          parentsId: '@'
        },
        link: function(scope) {
          var sourceRefs, attachContext;
          scope.pageSize = 25;
          scope.count = 0;
          scope.currentPage = 1;
          scope.allFolderSelected = false;
          scope.selectedFolder = null;
          scope.allSelected = false;
          scope.ready = false;

          //
          // functions to populate data
          //

          if (!!scope.personId) {
            fsApi.getPerson(scope.personId).then(function(response) {
              scope.person = response.getPerson();
            });
            fsApi.getPersonSourceRefs(scope.personId).then(function(response) {
              sourceRefs = response.getSourceRefs();
            });
          }
          else if (!!scope.coupleId) {
            fsApi.getCoupleSourceRefs(scope.coupleId).then(function(response) {
              sourceRefs = response.getSourceRefs();
            });
          }
          else if (!!scope.parentsId) {
            fsApi.getChildAndParentsSourceRefs(scope.parentsId).then(function(response) {
              sourceRefs = response.getSourceRefs();
            });
          }

          function getSourceDescriptions(folder, page) {
            var promise;
            var params = {
              start: (page-1) * scope.pageSize,
              count: scope.pageSize
            };
            if (folder === 'all') {
              promise = fsCurrentUserCache.getUser().then(function(user) {
                return fsApi.getCollectionSourceDescriptionsForUser(user.id, params);
              });
            }
            else {
              promise = fsApi.getCollectionSourceDescriptions(folder.id, params);
            }
            scope.busy = true;
            return promise.then(function(response) {
              scope.descriptions = response.getSourceDescriptions();
              scope.count = folder === 'all' ? scope.allDescriptionsCount : folder.size;
              scope.currentPage = page;
              scope.busy = false;
            });
          }

          scope.selectFolder = function(selectedFolder) {
            scope.allFolderSelected = selectedFolder === 'all';
            scope.homeFolder._selected = selectedFolder === scope.homeFolder;
            scope.folders.forEach(function(folder) {
              folder._selected = folder === selectedFolder;
            });
            scope.selectedFolder = selectedFolder;
            return getSourceDescriptions(selectedFolder, 1);
          };

          //
          // init data
          //

          function init() {
            scope.busy = true;
            fsCurrentUserCache.getUser().then(function(user) {
              fsApi.getCollectionsForUser(user.id).then(function(response) {
                scope.homeFolder = _.find(response.getCollections(), function(collection) { return !collection.title; });
                scope.folders = _.reject(response.getCollections(), function(collection) { return !collection.title; });
                scope.allDescriptionsCount = _.reduce(response.getCollections(), function(sum, collection) {
                  return sum + collection.size;
                }, 0);
                scope.busy = false;
                // if a folder was previously selected, find it in the newly-read collections
                if (scope.selectedFolder && scope.selectedFolder !== 'all') {
                  scope.selectedFolder = _.find(response.getCollections(), {id: scope.selectedFolder.id});
                }
                scope.selectFolder(scope.selectedFolder || scope.homeFolder).then(function() {
                  scope.ready = true;
                });
              });
            });
          }

          init();

          //
          // functions for display and sorting
          //

          scope.setAllSelected = function() {
            scope.descriptions.forEach(function(description) {
              description._selected = scope.allSelected;
            });
          };

          scope.updateAllSelected = function() {
            scope.allSelected = _.all(scope.descriptions, function(description) {
              return description._isSelected;
            });
          };

          scope.isAttached = function(description) {
            return _.any(sourceRefs, function(sourceRef) {
              return sourceRef.$sourceDescriptionId === description.id;
            });
          };

          scope.getDescriptionModified = function(description) {
            return description.attribution.modified;
          };

          scope.getFolderTitle = function(folder) {
            return folder.title;
          };

          scope.getDescriptionFolderTitle = function(description) {
            if (!!description.componentOf) {
              var url = fsUtils.removeQueryFromUrl(description.componentOf.description);
              var folder = _.find(scope.folders.concat([scope.homeFolder]), function(folder) {
                return fsUtils.removeQueryFromUrl(folder.links.self.href) === url;
              });
              if (folder) {
                return folder === scope.homeFolder ? 'Home' : folder.title;
              }
            }
            return '';
          };

          scope.isAnySourceSelected = function() {
            return _.any(scope.descriptions, {_selected: true});
          };

          scope.unselectedFolder = function(folder) {
            return !folder._selected;
          };

          //
          // folder action functions
          //

          scope.createFolder = function() {
            fsFolderModal.open().then(function(title) {
              if (!!title) {
                var folder = new fsApi.Collection({title: title});
                scope.busy = true;
                folder.$save(true).then(function() {
                  scope.folders.push(folder);
                  scope.busy = false;
                });
              }
            });
          };

          scope.renameFolder = function(folder) {
            fsFolderModal.open(folder.title).then(function(title) {
              if (!!title) {
                folder.title = title;
                scope.busy = true;
                folder.$save(true).then(function() {
                  scope.busy = false;
                });
              }
            });
          };

          scope.removeFolder = function(folder) {
            if (folder.size > 0) {
              fsConfirmationModal.open({
                title: 'Folder is Not Empty',
                subtitle: 'A folder that is not empty cannot be removed',
                okLabel: 'OK'
              });
            }
            else {
              scope.busy = true;
              folder.$delete().then(function() {
                _.remove(scope.folders, {id: folder.id});
                scope.busy = false;
                scope.selectFolder(scope.homeFolder);
              });
            }
          };

          //
          // description action functions
          //

          scope.moveSources = function(folder) {
            scope.busy = true;
            fsApi.moveSourceDescriptionsToCollection(folder.id, _.filter(scope.descriptions, {_selected: true})).then(function() {
              scope.busy = false;
              init(); // too much trouble to manage counts incrementally, especially if the 'all' folder is selected
            });
          };

          function removeSources(descriptions) {
            return fsConfirmationModal.open({
              title: (descriptions.length > 1 ? 'Remove Sources' : 'Remove Source'),
              subTitle: (descriptions.length > 1 ?
                'Are you sure that you want to remove these sources from your source box? ' +
                'Removing sources will not detach them from the ancestors that you have attached them to. ' +
                'It will remove them only from your source box and any folder they might be in.' :
                'Are you sure that you want to remove this source from your source box? ' +
                'Removing this source will not detach it from the ancestors that you have attached it to. ' +
                'It will remove it only from your source box and any folder it might be in.'),
              okLabel: 'Yes'
            }).then(function() {
              scope.busy = true;
              return fsApi.removeSourceDescriptionsFromCollections(descriptions).then(function() {
                scope.busy = false;
              });
            });
          }

          function removeSourceFromScope(description) {
            _.remove(scope.descriptions, description);
            scope.allDescriptionsCount--;
            if (!scope.allFolderSelected) {
              scope.selectedFolder.size--;
            }
          }

          scope.removeSources = function() {
            removeSources(_.filter(scope.descriptions, {_selected: true})).then(function() {
              init(); // too much trouble to manage counts incrementally, especially if the 'all' folder is selected
            });
          };

          scope.removeSource = function(description) {
            removeSources([description]).then(function() {
              removeSourceFromScope(description);
            });
          };

          scope.toggleOpen = function(description) {
            description._open = !description._open;
            if (description._open && description._sourceRefsCount == null) {
              description.$getSourceRefsQuery().then(function(response) {
                description._sourceRefsCount =
                  response.getPersonSourceRefs().length +
                  response.getCoupleSourceRefs().length +
                  response.getChildAndParentsSourceRefs().length;
              });
            }
          };

          scope.attachSource = function(description) {
            scope.busy = true;
            var promise;
            if (!!attachContext) {
              promise = $q.when(attachContext);
            }
            else if (!!scope.personId) {
              promise = fsApi.getPerson(scope.personId).then(function(response) {
                attachContext = {
                  person: response.getPerson()
                };
                return attachContext;
              });
            }
            else if (!!scope.coupleId) {
              promise = fsApi.getCouple(scope.coupleId, {persons: true}).then(function (response) {
                var couple = response.getRelationship();
                attachContext = {
                  couple: couple,
                  husband: response.getPerson(couple.$getHusbandId()),
                  wife: response.getPerson(couple.$getWifeId())
                };
                return attachContext;
              });
            }
            else if (!!scope.parentsId) {
              promise = fsApi.getChildAndParents(scope.parentsId, {persons: true}).then(function (response) {
                var parents = response.getRelationship();
                attachContext = {
                  parents: parents,
                  father: !!parents.$getFatherId() ? response.getPerson(parents.$getFatherId()) : null,
                  mother: !!parents.$getMotherId() ? response.getPerson(parents.$getMotherId()) : null,
                  child: response.getPerson(parents.$getChildId())
                };
                return attachContext;
              });
            }
            promise.then(function(attachContext) {
              fsSourceUtils.attachSource(description, attachContext).then(function(sourceRef) {
                sourceRefs.push(sourceRef);
                if (description._sourceRefsCount != null) {
                  description._sourceRefsCount++;
                }
                $rootScope.$emit('saved', sourceRef);
                scope.busy = false;
              });
            });
          };

          scope.createSource = function(description) {
            scope.busy = true;
            fsSourceUtils.createSource(true, description).then(function (response) {
              var promise;
              if (scope.allFolderSelected || scope.selectedFolder === scope.homeFolder) {
                promise = $q.when(null);
              }
              else {
                promise = fsApi.moveSourceDescriptionsToCollection(scope.selectedFolder.id, [response.description]);
              }
              promise.then(function() {
                scope.descriptions.push(response.description);
                scope.allDescriptionsCount++;
                if (!scope.allFolderSelected) {
                  scope.selectedFolder.size++;
                }
                scope.busy = false;
                if (response.attach) {
                  scope.attachSource(response.description);
                }
              });
            }, function() {
              scope.busy = false;
            });
          };

          scope.copySource = function(description) {
            scope.createSource(description);
          };

          scope.showSourceAttachments = function(description) {
            fsSourceAttachmentsModal.open(description).then(function(sourceRefContextToDetach) {
              if (!!sourceRefContextToDetach) {
                scope.busy = true;
                fsSourceUtils.detachSource(sourceRefContextToDetach).then(function() {
                  scope.busy = false;
                  if (description._sourceRefsCount != null) {
                    description._sourceRefsCount--;
                  }
                  _.remove(sourceRefs, {id: sourceRefContextToDetach.sourceRef.id});
                }, function() {
                  scope.busy = false;
                });
              }
            });
          };

          scope.viewSource = function(description) {
            fsSourceDescriptionModal.open(description, false).then(function(action) {
              if (action === 'delete') {
                scope.busy = true;
                fsSourceUtils.deleteSource(description).then(function() {
                  removeSourceFromScope(description);
                  scope.busy = false;
                  $rootScope.$emit('deleted', description);
                }, function() {
                  scope.busy = false;
                });
              }
              else if (action === 'showAttachments') {
                scope.showSourceAttachments(description);
              }
            });
          };

          //
          // paging and navigation functions
          //

          scope.pageChanged = function(page) {
            getSourceDescriptions(scope.selectedFolder, page);
          };

          if (!!scope.personId) {
            scope.personHref = fsLocation.getPersonUrl(scope.personId);
          }
          else if (!!scope.coupleId) {
            scope.coupleHref = fsLocation.getCoupleUrl(scope.coupleId);
          }
          else if (!!scope.parentsId) {
            scope.parentsHref = fsLocation.getParentsUrl(scope.parentsId);
          }

        }
      };
    });
})();
