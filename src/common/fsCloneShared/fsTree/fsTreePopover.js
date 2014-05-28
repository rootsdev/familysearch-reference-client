(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsTreePopover', function($document) {

      return {
        scope: {
          family: '=',
          popoverArrow: '@',
          popoverHover: '@',
          popoverContent: '@',
          debug: '@'
        },

        link: function($scope, element) {
          var popoverArrowElements = element.children($scope.popoverArrow);
          var popoverContentElement = element.children($scope.popoverContent);

          var parent = element;
          var popoverHoverElement = parent.find($scope.popoverHover);
          while( !popoverHoverElement.length && parent.length ) {
            parent = parent.parent();
            popoverHoverElement = parent.find($scope.popoverHover);
          }

          var mouseOverHoverPoint = false;
          var mouseOverElement = false;
          var popoverArrowClicked = 0;


          var ignoreThisMouseClick = false;
          popoverContentElement.click(function(){
            ignoreThisMouseClick = true;
          });


          function showOrHide() {
            if ( popoverArrowClicked ) {
              $scope.arrowOpen = true;
              popoverContentElement.show();
            } else {
              $scope.arrowOpen = false;
              popoverContentElement.hide();
            }



            if ( mouseOverHoverPoint || mouseOverElement || popoverArrowClicked ) {
              popoverArrowElements.show();
            } else {
              popoverArrowElements.hide();
            }
          }
          showOrHide();


          element.on('mouseenter',function(){
            mouseOverElement = true;
            if ($scope.debug) {
              console.log(mouseOverHoverPoint, mouseOverElement, popoverArrowClicked );
            }
            showOrHide();
          });

          element.on('mouseleave',function(){
            mouseOverElement = false;
            if ($scope.debug) {
              console.log(mouseOverHoverPoint, mouseOverElement, popoverArrowClicked );
            }
            showOrHide();
          });


          popoverHoverElement.on('mouseenter',function(){
            mouseOverHoverPoint = true;
            showOrHide();

          });
          popoverHoverElement.on('mouseleave',function(){
            mouseOverHoverPoint = false;
            showOrHide();
          });

          popoverArrowElements.on('click',function(){
            if ( !popoverArrowClicked ) {
              popoverArrowClicked = popoverArrowClicked +1;
            } else {
              popoverArrowClicked = 0;
              mouseOverElement = false;
            }
          });


          $document.on('click', function(){
            if ( ignoreThisMouseClick ) {
              ignoreThisMouseClick = false;
              return;
            }
            if ( popoverArrowClicked===1 ) {
              popoverArrowClicked=2;
            } else {
              popoverArrowClicked=0;
            }
            showOrHide();
          });
        }
      };
    });
})();
