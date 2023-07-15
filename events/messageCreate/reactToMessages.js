require("dotenv/config");
const channels = require("../../channels");

module.exports = (message) => {
  if (message.author.bot) return; //if the sender is a bot
  if (
    message.channelId != channels.USD &&
    message.channelId != channels.MacroBoosting &&
    message.channelId != channels.Feedback
  )
    return;

  message.react("✅");
  message.react("❌");
};
