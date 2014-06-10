(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsTree', function (fsApi, $state) {
      return {
        templateUrl: 'fsCloneShared/fsTree/fsTree.tpl.html',
        scope: {
          person: '=',
          spouse: '='
        },
        controller: function($scope, $element, fsApi, Family) {
            $scope.family = Family.prototype.build($scope.person, $scope.spouse);
            var contentElement = $element.find('.pan-zoom-contents');
            $scope.moveLeft = function(event) {
//              var position = movableDiv.position();
//              movableDiv.css('left', movableDiv.position().left - 50 );
              event.preventDefault();
              console.log($scope.model.pan.x,$scope.model.pan.x-50);

              $scope.model.pan.x = $scope.model.pan.x - 50;

              var getCssScale = function(zoomLevel) {
                return Math.pow($scope.config.scalePerZoomLevel, zoomLevel - $scope.config.neutralZoomLevel);
              };

              var scaleString = 'scale(' + getCssScale($scope.model.zoomLevel) + ')';

              contentElement.css('transform-origin', '0 0');
              contentElement.css('ms-transform-origin', '0 0');
              contentElement.css('webkit-transform-origin', '0 0');
              contentElement.css('transform', scaleString);
              contentElement.css('ms-transform', scaleString);
              contentElement.css('webkit-transform', scaleString);
              contentElement.css('left', $scope.model.pan.x);
              contentElement.css('top', $scope.model.pan.y);
              console.log(contentElement.css('left'));
            };

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
              haltSpeed: 10

            };
            $scope.model = {};

            $scope.navigateTo = function() {
                $state.go('person', { personId: $scope.person.id });
            };


        }
      };
    });
})();
