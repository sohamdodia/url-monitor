const mongoose = require('mongoose');
const config = require('./config');
const { urldata } = require('./modules/url/models/url.data.model');
const axios = require('axios');


const sendRequestAndStoreData = async ({ _id, url, method, data, headers }, i) => {

  const json = {
    method,
    url,
    headers
  };

  if (method !== 'get') {
    json.data = data
  };

  const startTime = new Date().getTime();
  try {
    await axios(json);
  } catch (error) {
    //ignore the error
  }
  const urlData = new urldata({
    urlId: _id,
    time: new Date().getTime() - startTime
  });
  await urlData.save();
  return i;
}

const startMonitoring = async (urls) => {
  let count = 0;
  urls.forEach(async (url) => {
    let result = await sendRequestAndStoreData(url, count);
    if (count == urls.length - 1) {
      console.log('close connection ===>');
      mongoose.connection.close();
    } else {
      count++;
    }
  })
}

mongoose.connect(config.const.dbUri, (async (err) => {
  if (err) {
    console.log('Could not connect to MongoDB', err);
  } else {
    mongoose.set('debug', false);
    startMonitoring(JSON.parse(process.argv[2]));
  }
}));

