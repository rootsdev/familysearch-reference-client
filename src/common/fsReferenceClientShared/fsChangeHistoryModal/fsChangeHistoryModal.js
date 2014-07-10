(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsChangeHistoryModal', function(_, $modal, fsApi, fsChangeUtils, fsRestoreChangeModal) {
      return {
        open: function(opts) { // { person | (couple, husband, wife) | (parents, child, father, mother), item}
          function open() {
            return $modal.open({
              templateUrl: 'fsReferenceClientShared/fsChangeHistoryModal/fsChangeHistoryModal.tpl.html',
              size: 'lg',
              controller: function($scope) {
                $scope.person = opts.person;
                $scope.couple = opts.couple;
                $scope.husband = opts.husband;
                $scope.wife = opts.wife;
                $scope.parents = opts.parents;
                $scope.child = opts.child;
                $scope.father = opts.father;
                $scope.mother = opts.mother;
                $scope.busy = false;
                $scope.changes = [];
                var fromChangeId = '';
                var moreChanges = true;
                var isFiltering = !!opts.item;
                var changedItemIds = {};
                var deletedItemIds = {};

                function readChanges(count) {
                  if (moreChanges && !$scope.busy) {
                    $scope.busy = true;
                    var requestOpts = {count: count * (isFiltering ? 10 : 1)};
                    if (!!fromChangeId) {
                      requestOpts.from = fromChangeId;
                    }
                    var promise;
                    if (!!$scope.person) {
                      promise = fsApi.getPersonChanges($scope.person.id, requestOpts);
                    }
                    else if (!!$scope.couple) {
                      promise = fsApi.getCoupleChanges($scope.couple.id, requestOpts);
                    }
                    else if (!!$scope.parents) {
                      promise = fsApi.getChildAndParentsChanges($scope.parents.id, requestOpts);
                    }
                    promise.then(function(response) {
                      $scope.busy = false;
                      if (response.getChanges().length < requestOpts.count) {
                        moreChanges = false;
                      }
                      response.getChanges().forEach(function(change) {
                        var changedItemId = fsChangeUtils.getChangedItemId(change);
                        if (!isFiltering || opts.item.id === changedItemId) {
                          if (changedItemId) {
                            var key = changedItemId + (change.changeInfo[0].objectType || '');
                            if (fsChangeUtils.isDeletion(change)) {
                              change._isDeleted = true;
                              deletedItemIds[key] = true;
                            }
                            else if (deletedItemIds[key]) {
                              change._isDeleted = true;
                            }
                            if (changedItemIds[key]) {
                              if (!fsChangeUtils.isDeletion(change)) {
                                change._isRestorable = true;
                              }
                            }
                            else {
                              changedItemIds[key] = true;
                            }
                          }
                          $scope.changes.push(change);
                          count--;
                        }
                        fromChangeId = change.id;
                      });
                      if (moreChanges && count > 0) {
                        readChanges(count);
                      }
                    });
                  }
                }

                $scope.getMoreChanges = function() {
                  readChanges(8);
                };

                $scope.getMoreChanges(); // kick things off

                $scope.$on('restore', function(event, change) {
                  event.stopPropagation();
                  $scope.$close(change);
                });

              }
            }).result.then(function(change) {
                if (!!change) {
                  return fsRestoreChangeModal.open({
                    change: change,
                    person: opts.person,
                    couple: opts.couple,
                    husband: opts.husband,
                    wife: opts.wife,
                    parents: opts.parents,
                    father: opts.father,
                    mother: opts.mother,
                    child: opts.child
                  }).then(function() {
                    return open();
                  }, function() {
                    return open();
                  });
                }
              });
          }

          return open();
        }
      };
    });
})();