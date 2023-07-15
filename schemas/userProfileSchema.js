const { Schema, model } = require("mongoose");

const userProfileSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  USD: {
    type: Number,
    default: 0,
  },
  MacroBoosting: {
    type: Number,
    default: 0,
  },
  Feedback: {
    type: Number,
    default: 0,
  },
});

const UserProfile = model("UserProfile", userProfileSchema);

module.exports = UserProfile;
