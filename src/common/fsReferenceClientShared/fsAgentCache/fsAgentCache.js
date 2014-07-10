(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsAgentCache', function($q, fsApi) {
      var agentMap = {};

      return {
        getAgent: function(urlOrId) {
          var key = urlOrId.substr(urlOrId.indexOf('?')+1); // remove access token from url
          if (!!agentMap[key]) {
            return $q.when(agentMap[key]);
          }
          else {
            return fsApi.getAgent(urlOrId).then(function(response) {
              var agent = response.getAgent();
              agentMap[key] = agent;
              return agent;
            });
          }
        }
      };
    });
})();