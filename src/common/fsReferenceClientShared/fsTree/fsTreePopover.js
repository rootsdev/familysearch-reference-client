(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsTreePopover', function($document) {

      return {
        scope:true,
        link: function($scope,element) {


          var hoverControlsSelector = element.attr('show-on-hover');
          var hoverControls = element.find(hoverControlsSelector);

          hoverControls.hide();
          $scope.hoverVisible = false;
          $scope.clickState = '';

          $scope.dismissHoverControls = function() {
            if ( $scope.hoverVisible ) {
              hoverControls.fadeOut(125);
              $scope.hoverVisible = false;
              $scope.clickState = '';
            }
          };

          $scope.showHoverControls = function() {
            if ( !$scope.hoverVisible ) {
              $scope.hoverVisible = true;
              $scope.toggleClickState('');
              hoverControls.show();
              $scope.$digest();
            }
          };


          $scope.toggleClickState = function(s) {
            if ($scope.clickState===s) {
              $scope.clickState='';
            } else {
              $scope.clickState=s;
            }
          };

          $scope.getClickState = function() {
            return $scope.clickState;
          };

          element.mouseenter(function(){
            $scope.showHoverControls();
          });

          element.mouseleave(function(){
            if ( $scope.getClickState()==='' ) {
              $scope.dismissHoverControls();
            }
          });

          $document.click(function(event){
            if ( angular.element(event.target).closest(element).length === 0 ) {
              $scope.dismissHoverControls();
            }

          });

        }
      };
    });
})();
