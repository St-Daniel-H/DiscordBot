require("dotenv/config");
module.exports = (message) => {
  if (message.author.bot) return; //if the sender is a bot
  if (
    message.channelId != process.env.USD_CHANNEL &&
    message.channelId != process.env.MACRO_CHANNEL &&
    message.channelId != process.env.FEEDBACK_CHANNEL
  )
    return;

  message.react("✅");
  message.react("❌");
};
