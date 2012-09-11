var reducer = require('../index.js');

reducer.histogram({
  keypath: ['source'],
  fields: ['source', 'frequency'],
  format: function (source) {
    return source.replace(/^<a [^>]+>/i, '').replace(/<\/a>$/i, '');
  }
});
