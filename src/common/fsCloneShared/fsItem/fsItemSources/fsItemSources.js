(function(){
  'use strict';
  angular.module('fsCloneShared')
    .directive('fsItemSources', function(_, fsApi, $q) {
      return {
        templateUrl: 'fsCloneShared/fsItem/fsItemSources/fsItemSources.tpl.html',
        scope: {
          item: '=',
          person: '=',
          sourceRefs: '='
        },
        link: function(scope) {
          // register an open state handler that gets sourceDescriptions for each applicable sourceRef
          function getItemTag(item) {
            if (item instanceof fsApi.Name) {
              return 'http://gedcomx.org/Name';
            }
            else if (item instanceof fsApi.Fact) {
              return item.type;
            }
            else { // the only other possibility
              return 'http://gedcomx.org/Gender';
            }
          }

          scope.item._onOpen(function(item) {
            if (!!scope.sourceRefs && !scope.sources) {
              scope.sources = [];

              var taggedSourceRefs = _.filter(scope.sourceRefs, function (sourceRef) {
                return _.contains(sourceRef.$getTags(), getItemTag(item));
              });
              if (taggedSourceRefs.length) {
                return $q.all(taggedSourceRefs.map(function (sourceRef) {
                  return $q.all([sourceRef.$getSourceDescription(), sourceRef.attribution.$getAgent()]).then(function(responses) {
                    scope.sources.push({
                      ref: sourceRef,
                      description: responses[0].getSourceDescription(),
                      agent: responses[1].getAgent()
                    });
                  });
                }));
              }
            }
            return null;
          });

        }
      };
    });
})();