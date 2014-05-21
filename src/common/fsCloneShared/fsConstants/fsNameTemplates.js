(function(){
  'use strict';
  angular.module('fsCloneShared')
    .constant('fsNameTemplates', [
      {template: 'Standard', langs: ['']},
      {template: 'Spanish', langs: ['es']},
      {template: 'Portuguese', langs: ['pt']},
      {template: 'Cyrillic', langs: ['ru', '']},
      {template: 'Chinese', langs: ['zh-Hani', '']},
      {template: 'Japanese', langs: ['ja-Hani', 'ja', '']},
      {template: 'Khmer', langs: ['km', '']},
      {template: 'Korean', langs: ['ko', 'ko-Hani', '']},
      {template: 'Mongolian', langs: ['mn-Cyrl', '']},
      {template: 'Thai', langs: ['th', '']}
    ]);
})();