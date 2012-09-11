var reducer = require('../index.js');

// https://api.twitter.com/1/help/languages.json
var langs = {
  pt: 'Portuguese',
  de: 'German',
  id: 'Indonesian',
  'zh-cn': 'Simplified Chinese',
  msa: 'Malay',
  ko: 'Korean',
  'zh-tw': 'Traditional Chinese',
  fr: 'French',
  en: 'English',
  th: 'Thai',
  he: 'Hebrew',
  nl: 'Dutch',
  it: 'Italian',
  hu: 'Hungarian',
  ar: 'Arabic',
  pl: 'Polish',
  tr: 'Turkish',
  fi: 'Finnish',
  es: 'Spanish',
  no: 'Norwegian',
  fil: 'Filipino',
  fa: 'Persian',
  ur: 'Urdu',
  ja: 'Japanese',
  sv: 'Swedish',
  hi: 'Hindi',
  ru: 'Russian',
  da: 'Danish'
};

reducer.histogram({
  users: true,
  keypath: ['lang'],
  fields: ['language', 'frequency'],
  format: function (code) { return langs[code]; }
});
