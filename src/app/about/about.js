angular.module("fsClone.about", [
  'ui.router'
])
.config(function ($stateProvider) {
  $stateProvider.state('about', {
    url: '/about',
    views: {
      "main": {
        controller: 'AboutController',
        templateUrl: 'about/about.tpl.html'
      }
    },
    data:{ pageTitle: 'About' }
  });
})

.controller('AboutController', function ($scope) {

  var init = function() {
    // A definitive place to put everything that needs to run when the controller starts. Avoid
    //  writing any code outside of this function that executes immediately.
  };

  init();
});
