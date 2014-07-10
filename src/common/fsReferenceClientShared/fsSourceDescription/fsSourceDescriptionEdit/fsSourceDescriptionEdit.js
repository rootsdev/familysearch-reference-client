(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsSourceDescriptionEdit', function(fsUtils) {
      return {
        templateUrl: 'fsReferenceClientShared/fsSourceDescription/fsSourceDescriptionEdit/fsSourceDescriptionEdit.tpl.html',
        scope: {
          description: '=',
          agent: '='
        },
        link: function(scope) {
          scope.form = {
            title: scope.description.$getTitle(),
            url: scope.description.about,
            citation: scope.description.$getCitation(),
            notes: scope.description.$getText(),
            reason: ''
          };

          // save the form to the fact
          scope.$on('save', function(event) {
            event.stopPropagation();
            scope.submitted = true;
            if (!!scope.form.title) { // title is required
              scope.description
                .$setTitle(scope.form.title)
                .$setCitation(scope.form.citation)
                .$setText(scope.form.notes)
                .about = fsUtils.makeUrl(scope.form.url); // this mimics FS behavior
              scope.$parent.$emit('save', scope.description, scope.form.reason);
            }
          });

        }
      };
    });
})();