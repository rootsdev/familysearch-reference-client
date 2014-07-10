(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .factory('fsNameUtils', function(_, fsNameTemplates) {

      return {
        getPrimaryLang: function(nameForms) {
          var nameForm = _.find(nameForms, function(form) { return !!form.lang; });
          return !!nameForm ? nameForm.lang :
            (!!nameForms && nameForms.length > 0 && !!nameForms[0].lang ? nameForms[0].lang : '');
        },

        getTemplate: function(primaryLang) {
          return _.find(fsNameTemplates, function(template) { return _.contains(template.langs, primaryLang); });
        },

        getNameFormOrderByFunction: function(template) {
          return function(nameForm) {
            var ix = template.langs.indexOf(nameForm.lang || '');
            return ix >= 0 ? ix : 99;
          };
        }

    };
    });
})();
