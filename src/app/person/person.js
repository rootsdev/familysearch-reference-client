/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * 'src/app/home', however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a 'note' section could have the submodules 'note.create',
 * 'note.delete', 'note.edit', etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 */
(function(){
  'use strict';
  angular.module('fsClone.person', [
    'fsCloneShared',
    'ui.router'
  ])
    .config(function ($stateProvider) {
      $stateProvider.state('person', {
        url: '/person',
        views: {
          'main': {
            controller: 'PersonController',
            templateUrl: 'person/person.tpl.html'
          }
        },
        data: { pageTitle: 'Person' }
      });
    })

    // As you add controllers to a module and they grow in size, feel free to place them in their own files.
    // Let each module grow organically, adding appropriate organization and sub-folders as needed.
    .controller('PersonController', function ($scope) {

      var init = function () {
        $scope.lifeSketchState = 'closed';
        $scope.vitalFactsState = 'open';
        $scope.otherFactsState = 'open';
        $scope.notesState = 'open';
      };

      init();
    });
})();
