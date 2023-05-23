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

module.exports = { CodechefSchema: CodechefSchema };
