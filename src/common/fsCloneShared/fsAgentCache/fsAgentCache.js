(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsAgentCache', function($q, fsApi) {
      var agentMap = {};

      return {
        getAgent: function(url) {
          var key = url.substr(url.indexOf('?')+1); // remove access token
          if (!!agentMap[key]) {
            return $q.when(agentMap[key]);
          }
          else {
            return fsApi.getAgent(url).then(function(response) {
              var agent = response.getAgent();
              agentMap[key] = agent;
              return agent;
            });
          }
        }
      };
    });
})();