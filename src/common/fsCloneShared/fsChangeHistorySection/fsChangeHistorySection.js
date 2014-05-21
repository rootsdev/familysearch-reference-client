(function(){

    'use strict';
    angular.module('fsCloneShared')
        .directive('fsChangeHistorySection', function (fsApi, $rootScope) {
            return {
                templateUrl: 'fsCloneShared/fsChangeHistorySection/fsChangeHistorySection.tpl.html',
                scope: {
                   person: '='
                },
                link: function(scope) {
                    function init() {
                        //noinspection JSUnresolvedVariable
                        if (!scope.person.living) {
                            fsApi.getPersonChanges(scope.person.id, {count: 10}).then(function(response) {
                                scope.changes = response.getChanges();
                            });
                        }

                    }

                    var unbindSaved = $rootScope.$on('saved', function() {
                        console.log('refresh changes');
                        init();
                    });
                    scope.$on('$destroy', unbindSaved);

                    var unbindDeleted = $rootScope.$on('deleted', function() {
                        console.log('refresh changes');
                        init();
                    });
                    scope.$on('$destroy', unbindDeleted);

                    init();
                }
            };
        });
})();
