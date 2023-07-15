const userProfile = require("../../schemas/userProfileSchema");
module.exports = async (reaction, user, client) => {
  if (
    reaction.message.channelId !== process.env.USD_CHANNEL &&
    reaction.message.channelId !== process.env.MACRO_CHANNEL &&
    reaction.message.channelId !== process.env.FEEDBACK_CHANNEL
  )
    return;
  if (user.id === client.user.id) {
    return; // Ignore the reaction added by the bot
  }
  if (reaction.emoji.name == "✅") {
    const message = reaction.message;
    const messageAuthorId = message.author.id; //get the deputy id.
    let userToUpdate = await userProfile.findOne({ userId: messageAuthorId });
    if (!userToUpdate) {
      reaction.message.reply("user not found");
      return;
    }
    if (reaction.message.channelId == process.env.USD_CHANNEL) {
      userToUpdate.USD -= 2;
    } else if (reaction.message.channelId == process.env.FEEDBACK_CHANNEL) {
      userToUpdate.Feedback -= 0.5;
    } else if (reaction.message.channelId == process.env.MACRO_CHANNEL) {
      userToUpdate.MacroBoosting -= 4;
    }
    try {
      await userToUpdate.save();
      console.log("User updated:", userToUpdate);
    } catch (error) {
      console.log("Error updating user:", error);
    }
  }
};
