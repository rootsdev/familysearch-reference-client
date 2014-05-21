(function(){
    'use strict';
    angular.module('fsCloneShared')
        .directive('fsChangeHistory', function () {
            return {
                templateUrl: 'fsCloneShared/fsChangeHistory/fsChangeHistory.tpl.html',
                scope: {
                    change: '='
                },
                link: function(scope) {
                    scope.setAgent = function() {
                        if (!scope.agent) {
                            scope.change.$getAgent().then(function(response) {
                                scope.agent = response.getAgent();
                            });
                        }
                    };
                }
            };
        });
})();