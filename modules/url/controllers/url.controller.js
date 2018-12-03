const mongoose = require('mongoose');
const Joi = require('joi');
const { spawn } = require('child_process');

const schema = require('../../../schema');
const helper = require('../../../helper');
const config = require('../../../config');
const message = require('../../../message');

const URL = mongoose.model('url');
const URLData = mongoose.model('urldata');

let monitoringStarted = false;

const startMonitoring = (urls) => {
  let urlBatchLength;

  if (urls.length < config.const.totalChildProcess) {
    urlBatchLength = Math.floor(config.const.totalChildProcess / urls.length);
  } else {
    urlBatchLength = Math.floor(urls.length / config.const.totalChildProcess);
  }

  while(urls.length > 0) {
    let batch = urls.splice(0, urlBatchLength);
    const child = spawn('node', ['cron.js', JSON.stringify(batch)], {
      detached: true,
      stdio: 'ignore'
    });
  }
};

exports.createURL = async (req, res) => {
  try {
    const validationResult = Joi.validate(
      req.body,
      schema.createURL,
      { abortEarly: false }
    );

    if (validationResult.error) {
      return res.status(400).send({
        status: false,
        message: validationResult.error.details[0].message
      });
    }
    
    req.body.method = req.body.method.toLowerCase();

    const url = new URL(req.body);
    const createURL = await url.save();

    return res.status(200).send({
      success: true,
      _id: createURL._id
    });

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: message.somethingWentWrong
    })
  }
};

exports.updateURL = async (req, res) => {
  try {
    const validationResult = Joi.validate(
      Object.assign({}, req.params, req.body),
      schema.updateURL,
      { abortEarly: false }
    );
    
    if (req.body.method) {
      req.body.method = req.body.method.toLowerCase();
    }
    
    if (validationResult.error) {
      return res.status(400).send({
        status: false,
        message: validationResult.error.details[0].message
      });
    }

    if(!helper.checkValidMongoID(req.params.id)) {
      return res.status(400).send({
        status: false,
        message: message.notValidId
      });
    }

    const fetchedURL = await URL.findById(req.params.id);
    if (!fetchedURL) {
      return res.status(404).send({
        status: false,
        message: message.urlNotFound
      });
    }
    
    await URL.findByIdAndUpdate(req.params.id, req.body);

    return res.status(200).send({
      success: true,
      _id: req.params.id
    });

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: message.somethingWentWrong
    });
  }
};

exports.getALlURLs = async (req, res) => {
  try {
    const urls = await URL.find({});
    return res.status(200).send({
      success: true,
      urls
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: message.somethingWentWrong
    });
  }
}

exports.getURL = async (req, res) => {
  try {
    const validationResult = Joi.validate(
      req.params,
      schema.deleteURL,
      { abortEarly: false }
    );

    if (validationResult.error) {
      return res.status(400).send({
        status: false,
        message: validationResult.error.details[0].message
      });
    }

    if(!helper.checkValidMongoID(req.params.id)) {
      return res.status(400).send({
        status: false,
        message: message.notValidId
      });
    }

    const fetchedURL = await URL.findURL(req.params.id);

    if (!fetchedURL.length) {
      return res.status(404).send({
        status: false,
        message: 'URL not found with this id'
      });
    }

    const responseArray = [];
    fetchedURL[0].response.forEach(r => {
      responseArray.push(r.time)
    });

    const result = Object.assign({}, fetchedURL[0], { response: responseArray });

    const percentileArray = [
      { '50th_percentile': 0.50 }, 
      { '75th_percentile': 0.75 }, 
      { '95th_percentile': 0.95 }, 
      { '99th_percentile': 0.99 }
    ];

    for (let i = 0, len = percentileArray.length; i < len; i++) {
      for (let key in percentileArray[i]) {
        result[key] = helper.calculatePercentile(responseArray, percentileArray[i][key]);
      }
    }

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: 'Something went wrong'
    });
  }
}

exports.deleteURL = async (req, res) => {
  try {
    const validationResult = Joi.validate(
      req.params,
      schema.deleteURL,
      { abortEarly: false }
    );

    if (validationResult.error) {
      return res.status(400).send({
        status: false,
        message: validationResult.error.details[0].message
      });
    }

    if(!helper.checkValidMongoID(req.params.id)) {
      return res.status(400).send({
        status: false,
        message: 'Send valid id'
      });
    }

    const fetchedURL = await URL.findById(req.params.id);
    if (!fetchedURL) {
      return res.status(404).send({
        status: false,
        message: message.urlNotFound
      });
    }

    const url = URL.findByIdAndDelete(req.params.id);
    const urlData = URLData.remove({ urlId: req.params.id });
    await Promise.all([url, urlData]);

    return res.status(200).send({
      status: true
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: message.somethingWentWrong
    });
  }
}

exports.monitorURLs = async (req, res) => {
  if(!monitoringStarted) {
    monitoringStarted = true;
    setInterval(async () => {
      const urls = await URL.find({});
      startMonitoring(urls);
    }, config.const.intervalTime);
  }

  return res.status(200).send({
    status: true
  });
};