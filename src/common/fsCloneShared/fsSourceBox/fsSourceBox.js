(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsSourceBox', function($rootScope, fsApi, fsUserCache, fsUtils) {
      return {
        templateUrl: 'fsCloneShared/fsSourceBox/fsSourceBox.tpl.html',
        scope: {
          // pass in a personId, coupleId, or parentsId
          personId: '@',
          coupleId: '@',
          parentsId: '@'
        },
        link: function(scope) {
          var sourceRefs, selectedFolder;
          scope.pageSize = 25;
          scope.count = 0;
          scope.currentPage = 1;
          scope.allFolderSelected = false;
          scope.allSelected = false;
          scope.ready = false;

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
              promise = fsUserCache.getUser().then(function(user) {
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

          scope.selectFolder = function(selFolder) {
            scope.allFolderSelected = selFolder === 'all';
            scope.homeFolder._selected = selFolder === scope.homeFolder;
            scope.folders.forEach(function(folder) {
              folder._selected = folder === selFolder;
            });
            selectedFolder = selFolder;
            return getSourceDescriptions(selFolder, 1);
          };

          // init
          function readFolders() {
            scope.busy = true;
            fsUserCache.getUser().then(function(user) {
              fsApi.getCollectionsForUser(user.id).then(function(response) {
                scope.homeFolder = _.find(response.getCollections(), function(collection) { return !collection.title; });
                scope.folders = _.reject(response.getCollections(), function(collection) { return !collection.title; });
                scope.allDescriptionsCount = _.reduce(response.getCollections(), function(sum, collection) {
                  return sum + collection.size;
                }, 0);
                scope.selectFolder(scope.homeFolder).then(function() {
                  scope.ready = true;
                  scope.busy = false;
                });
              });
            });
          }

          readFolders();

          scope.setAllSelected = function() {
            console.log('setAllSelected', scope.allSelected);
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

          scope.pageChanged = function(page) {
            getSourceDescriptions(selectedFolder, page);
          };

          scope.leave = function() {
            if (!!scope.personId) {
              scope.$emit('navigate', 'person', {personId: scope.personId});
            }
            else if (!!scope.coupleId) {
              scope.$emit('navigate', 'couple', {coupleId: scope.coupleId});
            }
            else if (!!scope.parentsId) {
              scope.$emit('navigate', 'parents', {parentsId: scope.parentsId});
            }
          };

        }
      };
    });
})();
