var reducer = require('../index.js');

reducer.histogram({
  keypath: ['user', 'screen_name'],
  fields: ['user', 'tweets']
});
