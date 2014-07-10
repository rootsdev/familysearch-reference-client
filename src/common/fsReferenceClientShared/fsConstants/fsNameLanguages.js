(function(){
  'use strict';
  angular.module('fsReferenceClientShared')
    .constant('fsNameLanguages', [
      {lang: '', label: 'Roman', separator: ' ', parts: [
        {type: 'http://gedcomx.org/Prefix', label: 'Title'},
        {type: 'http://gedcomx.org/Given', label: 'First Names'},
        {type: 'http://gedcomx.org/Surname', label: 'Last Name'},
        {type: 'http://gedcomx.org/Suffix', label: 'Suffix'}
      ]},
      {lang: 'es', label: 'Spanish', separator: ' ', parts: [
        {type: 'http://gedcomx.org/Prefix', label: 'Title'},
        {type: 'http://gedcomx.org/Given', label: 'First Names'},
        {type: 'http://gedcomx.org/Surname', label: 'Last Names'},
        {type: 'http://gedcomx.org/Suffix', label: 'Suffix'}
      ]},
      {lang: 'pt', label: 'Portuguese', separator: ' ', parts: [
        {type: 'http://gedcomx.org/Prefix', label: 'Title'},
        {type: 'http://gedcomx.org/Given', label: 'First Names'},
        {type: 'http://gedcomx.org/Surname', label: 'Last Names'},
        {type: 'http://gedcomx.org/Suffix', label: 'Suffix'}
      ]},
      {lang: 'ru-Cyrl', label: 'Cyrillic', separator: ' ', parts: [
        {type: 'http://gedcomx.org/Prefix', label: 'Title'},
        {type: 'http://gedcomx.org/Given', label: 'First Names'},
        {type: 'http://gedcomx.org/Surname', label: 'Last Name'},
        {type: 'http://gedcomx.org/Suffix', label: 'Suffix'}
      ]},
      {lang: 'zh-Hani', label: 'Hanzi', separator: '', parts: [
        {type: 'http://gedcomx.org/Prefix', label: 'Title'},
        {type: 'http://gedcomx.org/Surname', label: 'Last Name'},
        {type: 'http://gedcomx.org/Given', label: 'First Names'},
        {type: 'http://gedcomx.org/Suffix', label: 'Suffix'}
      ]},
      {lang: 'ja-Hani', label: 'Kanji', separator: '', parts: [
        {type: 'http://gedcomx.org/Surname', label: 'Last Name'},
        {type: 'http://gedcomx.org/Given', label: 'First Names'},
        {type: 'http://gedcomx.org/Suffix', label: 'Suffix'}
      ]},
      {lang: 'ja', label: 'Kana', separator: '', parts: [
        {type: 'http://gedcomx.org/Surname', label: 'Last Name'},
        {type: 'http://gedcomx.org/Given', label: 'First Names'},
        {type: 'http://gedcomx.org/Suffix', label: 'Suffix'}
      ]},
      {lang: 'km', label: 'Khmer', separator: ' ', parts: [
        {type: 'http://gedcomx.org/Prefix', label: 'Title'},
        {type: 'http://gedcomx.org/Surname', label: 'Last Name'},
        {type: 'http://gedcomx.org/Given', label: 'First Names'},
        {type: 'http://gedcomx.org/Suffix', label: 'Suffix'}
      ]},
      {lang: 'ko', label: 'Hangul', separator: ' ', parts: [
        {type: 'http://gedcomx.org/Surname', label: 'Last Name'},
        {type: 'http://gedcomx.org/Given', label: 'First Names'},
        {type: 'http://gedcomx.org/Suffix', label: 'Suffix'}
      ]},
      {lang: 'ko-Hani', label: 'Hanja', separator: '', parts: [
        {type: 'http://gedcomx.org/Surname', label: 'Last Name'},
        {type: 'http://gedcomx.org/Given', label: 'First Names'},
        {type: 'http://gedcomx.org/Suffix', label: 'Suffix'}
      ]},
      {lang: 'mn-Cyrl', label: 'Mongolian', separator: ' ', parts: [
        {type: 'http://gedcomx.org/Prefix', label: 'Title'},
        {type: 'http://gedcomx.org/Surname', label: 'Last Name'},
        {type: 'http://gedcomx.org/Given', label: 'First Names'}
      ]},
      {lang: 'th', label: 'Thai', separator: ' ', parts: [
        {type: 'http://gedcomx.org/Prefix', label: 'Title'},
        {type: 'http://gedcomx.org/Given', label: 'First Names'},
        {type: 'http://gedcomx.org/Surname', label: 'Last Name'}
      ]}
    ]);
})();