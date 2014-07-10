(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsTree', function () {
      return {
        templateUrl: 'fsReferenceClientShared/fsTree/fsTree.tpl.html',
        scope: {
          person: '=',
          spouse: '='
        },
        controller: function($scope, $element, Family, $document, $window) {
          // BEGIN resize page divs for tree view.
          $document.find('.navbar').css('margin-bottom', 0);
          $document.find('body').css('padding-bottom', 0).css('overflow', 'hidden').css('height', '100%');
          $document.find('.mainContent').css('padding', 0).parent().removeClass('container').css('overflow', 'hidden');

          $scope.onResizeFunction = function() {
            var height = $window.innerHeight - $document.find('navbar').height();
            var div = $document.find('.mainContent').css('padding', 0).parent();
            div.css('height', height).css('width', $window.innerWidth);
          };

          $scope.onResizeFunction(); // Call to the function when the page is first loaded

          angular.element($window).bind('resize', function() {
            $scope.onResizeFunction();
            $scope.$apply();
          });

          $scope.family = new Family($scope.person, $scope.spouse);

          $scope.move = function(event,x,y) {
            $scope.model.pan({x:x,y:y});
            event.preventDefault();
          };
          // END resize page divs for tree view.

          /*
            Configuration options available for the panZoom control
           Object {zoomLevels: 5, neutralZoomLevel: 2, friction: 10, haltSpeed: 100, scalePerZoomLevel: 2…}
           friction: 10
           haltSpeed: 100
           initialPanX: 0
           initialPanY: 0
           initialZoomLevel: 2
           modelChangedCallback: function (){}
           neutralZoomLevel: 2
           scalePerZoomLevel: 2
           zoomButtonIncrement: 1
           zoomLevels: 5
           zoomStepDuration: 0.2
           zoomToFitZoomLevelFactor: 0.95
           */
            $scope.config = {
              friction:100,
              zoomStepDuration: 0.5,
              haltSpeed: 10,
              zoomOnDoubleClick: false,
              zoomOnMouseWheel: false,
              panOnClickDrag: true

            };
            $scope.model = {};

        }
      };
    }).directive('resize', function ($window) {
        return function (scope) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                scope.style = function () {
                    return {
                        'height': (newValue.h - 100) + 'px',
                        'width': (newValue.w - 100) + 'px'
                    };
                };

            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        };
    });





})();
