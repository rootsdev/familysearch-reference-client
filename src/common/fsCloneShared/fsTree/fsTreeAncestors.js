(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsTreeAncestors', function () {
      // At this point, the "element" is the COMMENT that
      // has been injected into the DOM as an anchor for
      // the subsequent transclusion.
      function link( $scope, element, attributes, nullController, transclude ) {

        transclude(
          $scope,
          function( clone ) {

            clone.css( 'border', '2px solid gold' );

            element.after( clone );

          }
        );

      }

      return {
        restrict: 'E',
        templateUrl: 'fsCloneShared/fsTree/fsTreeAncestors.tpl.html',
        link: link,
        transclude: 'element'

      };
    });
})();
