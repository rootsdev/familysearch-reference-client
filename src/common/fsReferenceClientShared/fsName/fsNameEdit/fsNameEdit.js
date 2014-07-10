(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .directive('fsNameEdit', function(_, $filter, fsUtils, fsNameTemplates, fsNameLanguages, fsNameUtils, fsNameTypes) {

      function partComparator(data) {
        return function(a, b) {
          var ixA = _.findIndex(data.parts, function(part) { return part.type === a; });
          var ixB = _.findIndex(data.parts, function(part) { return part.type === b; });
          return ixA >= 0 && ixB >= 0 ? ixA - ixB : 0;
        };
      }

      function getFullText(nameForm, primaryLang) {
        var formData = _.find(fsNameLanguages, {lang: nameForm.lang});
        var primaryData = _.find(fsNameLanguages, {lang: primaryLang});

        // use order from primaryData, but separator from formData
        // include all parts from formData even if not in primaryData
        return _.chain(formData.parts)
          .map(function(part) { return part.type; })
          .sort(partComparator(primaryData))
          .map(function(partType) { return _.find(nameForm.parts, {type: partType}); })
          .filter(function(part) { return !!part && !!part.value; })
          .map(function(part) { return part.value; })
          .value()
          .join(formData.separator);
      }

      function copyNameForms(nameForms) {
        // copy name forms from name
        return _.map(nameForms, function (nameForm) {
          var lang = nameForm.lang || '';
          return {
            lang: lang,
            label: _.find(fsNameLanguages, {lang: lang}).label,
            parts: _.map(nameForm.parts, function (part) {
              return {
                type: part.type,
                value: part.value
              };
            })
          };
        });
      }

      function updateNameForms(nameForms, template) {
        // remove nameForms not in use
        nameForms = _.filter(nameForms, function(nameForm) {
          return _.any(nameForm.parts, function(part) { return !!part.value; });
        });
        // apply the parts in this template to existing name forms that are in this template's languages
        var nameParts = _.find(fsNameLanguages, { lang: template.langs[0] }).parts;
        _.filter(nameForms, function(nameForm) { return _.contains(template.langs, nameForm.lang); })
          .forEach(function(nameForm) {
            // remove empty parts from existing nameForm
            nameForm.parts = _.filter(nameForm.parts, function(part) {
              return !!part.value;
            });
            // add parts to existing nameForm that are in the current template language
            nameForm.parts = nameForm.parts.concat(_.map(
              _.reject(nameParts, function(namePart) { return _.any(nameForm.parts, {type: namePart.type}); }),
              function(namePart) {
                return {
                  type: namePart.type,
                  value: ''
                };
              }));
          });
        // add additional nameForms for template languages not already found in nameForms
        nameForms = nameForms.concat(_.map(
          _.reject(template.langs, function(lang) { return _.any(nameForms, {lang: lang}); }), function(lang) {
          return {
            lang: lang,
            label: _.find(fsNameLanguages, {lang: lang}).label,
            parts: _.map(nameParts, function(part) {
              return {
                type: part.type,
                value: ''
              };
            })
          };
        }));
        // sort nameForms according to the order they appear in template, with extra nameForms at bottom
        var orderByFn = fsNameUtils.getNameFormOrderByFunction(template);
        nameForms.sort(function(a, b) {
          return orderByFn(a) - orderByFn(b);
        });
        return nameForms;
      }

      function getColumns(nameForms, primaryLang) {
        var defaultData = _.find(fsNameLanguages, {lang: ''});
        var primaryData = _.find(fsNameLanguages, {lang: primaryLang});
        // get unique part types
        var partTypes = _.uniq(_.flatten(_.map(nameForms, function(nameForm) {
          return _.map(nameForm.parts, function(part) { return part.type; });
        })));
        // sort in default order, then override with primary language order for those parts
        partTypes.sort(partComparator(defaultData));
        partTypes.sort(partComparator(primaryData));
        // return column type and label
        return _.map(partTypes, function(partType) {
          var part = _.find(primaryData.parts, {type: partType}) || _.find(defaultData.parts, {type: partType});
          return {
            type: partType,
            label: part.label
          };
        });
      }

      return {
        templateUrl: 'fsReferenceClientShared/fsName/fsNameEdit/fsNameEdit.tpl.html',
        scope: {
          name: '=',
          agent: '=',
          hideModified: '@',
          hideButtons: '@',
          hideReason: '@'
        },
        link: function(scope) {
          scope.templates = fsNameTemplates;
          scope.nameTypes = _.map(fsNameTypes, function(nameType) {
            return {
              label: $filter('fsGedcomxLabel')(nameType),
              value: nameType
            };
          });
          scope.nameTypes.push({label: 'Other', value: ''});
          scope.primaryLang = fsNameUtils.getPrimaryLang(scope.name.nameForms);

          function initForm() {
            var template = fsNameUtils.getTemplate(scope.primaryLang);
            scope.form = {
              nameType: scope.name.type || '',
              template: template,
              nameForms: updateNameForms(copyNameForms(scope.name.nameForms), template),
              reason: !!scope.form ? scope.form.reason : ''
            };
            scope.columns = getColumns(scope.form.nameForms, scope.primaryLang);
          }

          initForm();

          // name data may change in fsFindAddPersonForm
          scope.$watch(function() {
            return scope.name;
          }, function() {
            initForm();
          }, true);

          scope.showLangLabel = function() {
            return scope.form.nameForms.length > 1;
          };

          scope.getPart = function(nameForm, partType) {
            return _.find(nameForm.parts, {type: partType});
          };

          scope.getColumnClass = function(columnType) {
            if (columnType === 'http://gedcomx.org/Prefix' || columnType === 'http://gedcomx.org/Suffix') {
              return 'col-sm-2';
            }
            else if (columnType === 'http://gedcomx.org/Given' || columnType === 'http://gedcomx.org/Surname') {
              return 'col-sm-3';
            }
            return 'col-sm-2';
          };

          scope.setTemplate = function(template) {
            scope.form.template = template;
            scope.primaryLang = scope.form.template.langs[0];
            scope.form.nameForms = updateNameForms(scope.form.nameForms, scope.form.template);
            scope.columns = getColumns(scope.form.nameForms, scope.primaryLang);
          };

          // save the nameForms to the name
          scope.$on('save', function(event) {  // ignore item parameter so we can respond to broadcasted save in fsFindAddPersonForm
            if (event.stopPropagation) {
              event.stopPropagation();
            }
            // remove empty form.nameForms
            scope.form.nameForms = _.filter(scope.form.nameForms, function(nameForm) {
              return _.any(nameForm.parts, function(part) { return !!part.value; });
            });
            // set the nameForms
            scope.name.nameForms = _.map(scope.form.nameForms, function(nameForm) {
              return fsUtils.removeEmptyProperties({
                lang: nameForm.lang, // will be removed if empty
                parts: _.filter(nameForm.parts, function(part) { return !!part.value; }),
                fullText: getFullText(nameForm, scope.primaryLang)
              });
            });
            // set the type and emit the save event
            scope.name.$setType(scope.form.nameType);
            scope.$parent.$emit('save', scope.name, scope.form.reason);
          });

        }
      };
    });
})();
