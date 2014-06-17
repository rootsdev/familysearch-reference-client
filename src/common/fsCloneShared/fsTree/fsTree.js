(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsTree', function () {
      return {
        templateUrl: 'fsCloneShared/fsTree/fsTree.tpl.html',
        scope: {
          person: '=',
          spouse: '='
        },
        controller: function($scope, $element, fsApi, Family) {

          $scope.family = Family.prototype.build($scope.person, $scope.spouse);
//          $scope.family = Family.prototype.build();



            $scope.move = function(event,x,y) {
              $scope.model.pan({x:x,y:y});
              event.preventDefault();
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
              haltSpeed: 10,
              zoomOnDoubleClick: false,
              zoomOnMouseWheel: false,
              panOnClickDrag: true

            };
            $scope.model = {};

            $scope.navigateTo = function() {
              $scope.$emit('navigate', 'person', { personId: $scope.person.id });
            };


        }
      };
    });
})();
