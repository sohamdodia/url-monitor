require('dotenv').config();

exports.const = {
  apiPort: process.env.API_PORT || 6005,
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/url-monitor',
  serverRoutes: 'modules/*/routes/*.js',
  dbModels: 'modules/*/models/*.js',
  urlResponseLimit: 100,
  totalChildProcess: 4,
  intervalTime: 1000 // 1 second
};
