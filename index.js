var fs = require('fs')
  , util = require('util')
  , argv = require('optimist').argv
  , zlib = require('zlib')
  , JSONStream = require('JSONStream')
  , pathway = require('pathway')
  , data_file = fs.createReadStream(argv.i || argv.in)
  , out_file = fs.createWriteStream(argv.o || argv.out)
  ;

exports.run = function (opts) {

  if (opts.users) {
    exports.users(opts);
    return;
  }

  if (typeof opts.gzipped === 'undefined')
    opts.gzipped = data_file.path.match(/\.gz$/i);

  opts.keypath = opts.keypath || [true];
  var parser = JSONStream.parse(opts.keypath);

  if (opts.fields)
    exports.out(opts.fields);

  parser.on('data', opts.on_data);

  parser.on('error', function (error) {
    // TODO: handle error
    console.log('Error:', error);
  });

  parser.on('end', function () {
    if (opts.on_end) opts.on_end();
    out_file.end();
  });

  if (opts.gzipped)
    data_file.pipe(zlib.createUnzip()).pipe(parser);
  else
    data_file.pipe(parser);

};

exports.users = function (opts) {

  var keypath = opts.keypath
    , on_data = opts.on_data
    , screen_names = [];

  opts.users = false;
  opts.keypath = ['user'];

  opts.on_data = function (data) {
    // don't run callback on users we've already processed
    if (screen_names.indexOf(data.screen_name) < 0) {
      pathway(data, keypath).forEach(function (match) {
        on_data(match);
      });
    }
    screen_names.push(data.screen_name);
  };

  exports.run(opts);

};

exports.out = function (data) {
  if (util.isArray(data)) {
    data = data.map(sanitize);
    out_file.write(data.join('\t') + '\n');
  } else if (typeof data === 'string') {
    out_file.write(sanitize(data) + '\n');
  } else if (typeof data === 'object' && opts.fields) {
    var data_array = [];
    for (var i=0; i<opts.fields.length; i++) {
      data_array[i] = sanitize(data[opts.fields[i]]);
    }
    exports.out(data_array);
  }
};

exports.histogram = function (opts) {

  var keys = {};

  opts.on_data = function (data) {
    if (opts.format) data = opts.format(data);
    if (keys[data]) keys[data] +=1;
    else keys[data] = 1;
  };

  opts.on_end = function () {
    data = exports.sort(keys);
    for (var i=0; i<data.length; i++) {
      exports.out(data[i]);
    }
  };

  exports.run(opts);

};

// Helper methods

exports.to_array = function (obj) {
  arr = [];
  for (k in obj) {
    if (obj.hasOwnProperty(k))
      arr.push([ k, obj[k] ]);
  }
  return arr;
};

exports.sort = function (data, index) {
  index = index || 1; // index to sort on
  // convert to array first if object
  if (!util.isArray(data))
    data = exports.to_array(data);
  return data.sort(function (a, b) { return b[index] - a[index]; });
};

function sanitize(str) {
  if (typeof str !== 'string') return str;
  else return str.replace(/[\n\t\r\s]+/g, ' ').trim();
}
