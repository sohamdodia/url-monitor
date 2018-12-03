const mongoose = require('mongoose');
const { ObjectID } = require("mongodb");

const config = require('../../../config');
const { Schema } = mongoose;

const URLSchema = new Schema({
  url: {
    type: String
  },
  headers: {
    type: Object,
    default: {}
  },
  method: {
    type: String
  },
  data: {
    type: Object,
    default: {}
  }
}, { minimize: false }); //minimize will allow to store empty objects

URLSchema.statics.findURL = function (id) { //used simple function instead of arrow function because need to use 'this' keyword
  return new Promise(async (resolve, reject) => {
    try {
      const result = await this.aggregate([
        {
          $match: {
            _id: new ObjectID(id)
          }
        },
        {
          $lookup: {
            from: 'urldatas',
            let: { urldatas: '$urldatas'},
            pipeline: [
              {
                $match: {
                  urlId: new ObjectID(id)
                }
              },
              {
                $sort: {
                  createdAt: -1
                }
              },
              {
                $limit: config.const.urlResponseLimit
              },
              {
                $sort: {
                  time: 1
                }
              }
            ],
            as: 'response' 
          }
        }
      ]);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

mongoose.model('url', URLSchema);