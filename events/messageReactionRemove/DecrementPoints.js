const userProfile = require("../../schemas/userProfileSchema");
const channels = require("../../channels");

module.exports = async (reaction, user, client) => {
  if (
    reaction.message.channelId != channels.USD &&
    reaction.message.channelId != channels.MacroBoosting &&
    reaction.message.channelId != channels.Feedback
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
    if (reaction.message.channelId == channels.USD) {
      userToUpdate.USD -= 2;
    } else if (reaction.message.channelId == channels.Feedback) {
      userToUpdate.Feedback -= 0.5;
    } else if (reaction.message.channelId == channels.MacroBoosting) {
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
