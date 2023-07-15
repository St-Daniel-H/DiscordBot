const { ApplicationCommandOptionType } = require("discord.js");
const userProfile = require("../schemas/userProfileSchema");
module.exports = {
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "this command only work in a server",
        ephemeral: true,
      });
      return;
    }
    const targetUserId = interaction.options.getUser("target-user")?.id;
    if (!targetUserId) {
      interaction.reply({
        content: "please ping a user",
      });
      return;
    }
    // Check if the user has the specific role
    const member = interaction.guild.members.cache.get(interaction.user.id);
    const hasRequiredRole = member.roles.cache.has(
      process.env.senior_role || process.env.sheriff_role
    );
    if (!hasRequiredRole) {
      interaction.reply({
        content: "You don't have the required role to use this command",
        ephemeral: true,
      });
      return;
    }

    try {
      let user = await userProfile.findOne({ userId: targetUserId });
      if (!user) {
        interaction.reply({
          content: "user was not found!",
        });
        return;
      } else {
        interaction.reply({
          content:
            "user was  resetted! They previously had: USD: " +
            user.USD +
            ", feedback: " +
            user.Feedback +
            ", macro/boosting: " +
            user.MacroBoosting,
        });
        user.USD = 0;
        user.Feedback = 0;
        user.MacroBoosting = 0;
        await user.save();
      }
    } catch (err) {
      console.log(err);
    }
  },
  data: {
    name: "reset-user",
    description: "reset deputy balance",
    options: [
      {
        name: "target-user",
        description: "the user you want to reset",
        type: ApplicationCommandOptionType.User,
      },
    ],
  },
};