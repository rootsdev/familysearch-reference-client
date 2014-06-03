(function(){
  'use strict';
  angular.module('fsCloneShared')
    .factory('RecursionHelper', ['$compile', function($compile){
      return {
        /**
         * Manually compiles the element, fixing the recursion loop.
         * @param element
         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        compile: function(element, link, doRecursionExpression){
          if ( angular.isUndefined(doRecursionExpression)) {
            doRecursionExpression = 'false';
          }

          // Normalize the link parameter
          if(angular.isFunction(link)){
            link = { post: link };
          }

          // Break the recursion loop by removing the contents
          var contents = element.contents().remove();
          var compiledContents;
          return {
            pre: (link && link.pre) ? link.pre : null,
            /**
             * Compiles and re-adds the contents
             */
            post: function(scope, element){
              var doRecursion = true || scope.$eval(doRecursionExpression);
              if ( doRecursion ) {
                // Compile the contents
                if(!compiledContents){
                  compiledContents = $compile(contents);
                }

                // Re-add the compiled contents to the element
                compiledContents(scope, function(clone){
                  element.append(clone);
                });
              }

                // Call the post-linking function, if any
                if(link && link.post){
                  link.post.apply(null, arguments);
                }

            }
          };
        }
      };
    }]);
})();


(function() {
  'use strict';
  angular.module('fsCloneShared')
    .directive('tree', function(RecursionHelper) {
      return {
        restrict: 'E',
        scope: {family: '='},
        template:
          '<p>{{ family.name }}{{test }}</p>'+
          '<ul>' +
          '<li ng-repeat="child in family.children">' +
          '<tree family="child"></tree>' +
          '</li>' +
          '</ul>',
        compile: function(element) {
          return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
            // Define your normal link function here.
            // Alternative: instead of passing a function,
            // you can also pass an object with
            // a 'pre'- and 'post'-link function.
            console.log('scope ', scope.family);
            console.log(transcludeFn);

          });
        }
      };
    });
})();

