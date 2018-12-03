const mongoose = require('mongoose');

const { Schema } = mongoose;

const URLDataSchema = new Schema({
  urlId: {
    type: Schema.ObjectId,
    ref: 'url'
  },
  time: {
    type: Number
  },
  createdAt: {
    type: Number,
    default: Date.now
  }
});

const urldata = mongoose.model('urldata', URLDataSchema);

module.exports = {
  urldata
};