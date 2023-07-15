const { ApplicationCommandOptionType } = require("discord.js");
const userProfile = require("../../schemas/userProfileSchema");
module.exports = async (reaction, user, client) => {
  if (
    reaction.message.channelId !== process.env.USD_CHANNEL &&
    reaction.message.channelId !== process.env.MACRO_CHANNEL &&
    reaction.message.channelId !== process.env.FEEDBACK_CHANNEL
  )
    return;

  if (reaction.emoji.name == "✅" || reaction.emoji.name == "❌") {
    const guild = reaction.message.guild;
    const member = guild.members.cache.get(user.id);

    //const reactions = reaction.message.reactions.cache;
    const reactionX = reaction.message.reactions.cache.get("❌");
    const reactionCheck = reaction.message.reactions.cache.get("✅");

    const countX = reactionX ? reactionX.count : 0;
    const countCheck = reactionCheck ? reactionCheck.count : 0;

    console.log(`❌ Count: ${countX}`);
    console.log(`✅ Count: ${countCheck}`);

    if (countX > 2 || countCheck > 2) {
      //if senior already reacted.
      // Remove the reactions
      reaction.users.remove(user.id);
      reaction.message.reply("senior already reacted");
      return;
    }
    if (
      (countCheck == 2 && reaction.emoji.name == "❌") ||
      (countX == 2 && reaction.emoji.name == "✅")
    ) {
      reaction.users.remove(user.id);
      reaction.message.reply("senior already reacted");
      return;
    }

    // Check if the user is the bot itself
    if (user.id === client.user.id) {
      return; // Ignore the reaction added by the bot
    }
    // Check if the member has the required role
    if (
      !member.roles.cache.has(
        process.env.senior_role || process.env.sheriff_role
      )
    ) {
      reaction.message.reply("only seniors allowed to react");
      // Remove the reaction
      reaction.users.remove(user.id);
      return; //exit
    }
    //after passing all the tests, we know a senior reacted only once
    if (reaction.emoji.name == "✅") {
      const message = reaction.message;
      const messageAuthorId = message.author.id; //get the deputy id.
      let userToUpdate = await userProfile.findOne({ userId: messageAuthorId });
      if (!userToUpdate) {
        reaction.message.reply("user not found");
        return;
      }
      if (reaction.message.channelId == process.env.USD_CHANNEL) {
        userToUpdate.USD += 2;
      } else if (reaction.message.channelId == process.env.FEEDBACK_CHANNEL) {
        userToUpdate.Feedback += 0.5;
      } else if (reaction.message.channelId == process.env.MACRO_CHANNEL) {
        userToUpdate.MacroBoosting += 4;
      }
      try {
        await userToUpdate.save();
        console.log("User updated:", userToUpdate);
      } catch (error) {
        console.log("Error updating user:", error);
      }
    }
  }
};
