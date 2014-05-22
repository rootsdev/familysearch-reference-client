(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsTreePopover', function($document) {

      return {
        scope: {
          family: '=',
          popoverArrow: '@',
          popoverHover: '@',
          popoverContent: '@'
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

          function showOrHide() {
            if ( popoverArrowClicked ) {
              popoverContentElement.show();
            } else {
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
            showOrHide();
          });

          element.on('mouseleave',function(){
            mouseOverElement = false;
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
