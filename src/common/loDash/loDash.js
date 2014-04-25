(function(){
  'use strict';
  angular.module('loDash', [])
    .factory('_', function ($window) {
      return $window._;
    });
})();
