const mongoose = require("mongoose");
const Article = require("../models/article");

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  article_id: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        default: null,
      },
    ],
  },
});

module.exports = mongoose.model("User", usersSchema);
