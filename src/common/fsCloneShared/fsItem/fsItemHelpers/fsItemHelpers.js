(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('fsItemHelpers', function ($q) {
      return {
        mixinStateFunctions: function(item) {
          item._state = item._state || 'closed';

          item._isOpen = function() {
            return this._state === 'open';
          };

          item._isEditing = function() {
            return this._state === 'editing';
          };

          item._exists = function(param) {
            return !!this.id;
          };

          item._toggleOpen = function() {
            console.log('toggleOpen');
            this._state = this._state === 'open' ? 'closed' : 'open';
          };

          item._close = function() {
            this._state = 'closed';
          };

          item._edit = function() {
            this._state = 'editing';
          };

          item._cancelEdit = function() {
            this._state = this._exists() ? 'open' : 'closed';
          };

        },

        mixinAgentFunctions: function(scope, itemFn) {
          scope.agent = null;
          scope.$watch(function() { return itemFn()._state; }, function(newValue, oldValue) {
            var item = itemFn();
            if (newValue === 'open' && scope.agent === null && item && item.attribution) {
              console.log('getting agent');
              item.attribution.$getAgent().then(function(response) {
                scope.agent = response.getAgent();
                console.log('got agent');
              });
            }
          });
        }

      };
    });
})();