var reducer = require('../index.js');

reducer.histogram({
  users: true,
  keypath: ['location'],
  fields: ['location', 'frequency']
});
