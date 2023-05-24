const mongoose = require("mongoose");

const CodechefSchema = new mongoose.Schema({
  contestcode: {
    type: String,
    unique: true,
  },
  contestname: {
    type: String,
  },

  date: {
    type: String,
  },

  time: {
    type: String,
  },
  duration: {
    type: String,
  },
  refreshdate: {
    type: Number,
  },
});

const AtcoderSchema = new mongoose.Schema({
  contestname: {
    type: String,
    unique: true,
  },
  starttime: {
    type: String,
  },
  duration: {
    type: String,
  },
  ratedfor: {
    type: String,
  },
  refreshdate: {
    type: Number,
  },
});

const LeetcodeSchema = new mongoose.Schema({
  contestname: {
    type: String,
    unique: true,
  },
  time: {
    type: String,
  },
  refreshdate: {
    type: Number,
  },
});

module.exports = {
  CodechefSchema: CodechefSchema,
  AtcoderSchema: AtcoderSchema,
  LeetcodeSchema: LeetcodeSchema,
};
