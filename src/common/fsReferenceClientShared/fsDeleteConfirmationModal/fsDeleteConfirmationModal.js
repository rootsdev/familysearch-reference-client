(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsDeleteConfirmationModal', function(_, $modal, fsApi) {
      return {
        open: function(opts) { // { person | (couple, husband, wife) | (parents, child, father, mother)}
          return $modal.open({
            templateUrl: 'fsReferenceClientShared/fsDeleteConfirmationModal/fsDeleteConfirmationModal.tpl.html',
            size: 'lg',
            windowClass: 'deleteDialog',
            controller: function($scope) {
              _.extend($scope, opts);

              if (!!opts.person) {
                fsApi.getPersonWithRelationships(opts.person.id, {persons: true}).then(function(response) {
                  // lazy: display the first if multiple
                  $scope.parentsCount = response.getParentRelationships().length;
                  if ($scope.parentsCount > 0) {
                    var parentsRel = response.getParentRelationships()[0];
                    if (!!parentsRel.$getFatherId()) {
                      $scope.personFather = response.getPerson(parentsRel.$getFatherId());
                    }
                    if (!!parentsRel.$getMotherId()) {
                      $scope.personMother = response.getPerson(parentsRel.$getMotherId());
                    }
                  }
                  $scope.couplesCount = response.getSpouseRelationships().length;
                  if ($scope.couplesCount > 0) {
                    var spouseRel = response.getSpouseRelationships()[0];
                    $scope.personSpouse = response.getPerson(spouseRel.$getSpouseId(opts.person.id));
                  }
                });
                fsApi.getPersonSourceRefs(opts.person.id).then(function(response) {
                  $scope.sourcesCount = response.getSourceRefs().length;
                });
                fsApi.getPersonDiscussionRefs(opts.person.id).then(function(response) {
                  $scope.discussionsCount = response.getDiscussionRefs().length;
                });
              }
              else if (!!opts.couple) {
                fsApi.getCoupleSourceRefs(opts.couple.id).then(function(response) {
                  $scope.sourcesCount = response.getSourceRefs().length;
                });
              }
              else if (!!opts.parents) {
                fsApi.getChildAndParentsSourceRefs(opts.parents.id).then(function(response) {
                  $scope.sourcesCount = response.getSourceRefs().length;
                });
              }

              $scope.ok = function(changeMessage) {
                $scope.$close(changeMessage);
              };

              $scope.cancel = function() {
                $scope.$dismiss();
              };
            }
          }).result;
        }
      };
    });
})();