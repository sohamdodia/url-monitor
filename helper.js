const _ = require('lodash');
const glob = require('glob');
const { ObjectID } = require('mongodb');

// Get files by glob patterns

exports.getGlobbedPaths = (globPatterns, excludes) => {
  const urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  let output = [];

  if (_.isArray(globPatterns)) {
    globPatterns.foeEach((globPattern) => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map((file) => {
          if (_.isArray(excludes)) {
            for (let i in excludes) {
              file = file.replace(excludes[i], '');
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }
  return output;
};

exports.checkValidMongoID = (id) => {
  return ObjectID.isValid(id);
};

exports.calculatePercentile = (data, percentile) => {
  let index = Math.round(data.length * percentile);
  return data[index - 1]
};
