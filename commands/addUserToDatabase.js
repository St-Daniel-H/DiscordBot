const { ApplicationCommandOptionType } = require("discord.js");
const userProfile = require("../schemas/userProfileSchema");
const roles = require("../roles");

module.exports = {
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "this command only work in a server",
        ephemeral: true,
      });
      return;
    }
    // Check if the user has the specific role
    const member = interaction.guild.members.cache.get(interaction.user.id);
    const hasRequiredRole = member.roles.cache.has(
      roles.sheriff || roles.senior
    );
    if (!hasRequiredRole) {
      interaction.reply({
        content: "You don't have the required role to use this command",
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

    try {
      let user = await userProfile.findOne({ userId: targetUserId });
      if (user) {
        interaction.reply({
          content: "user already exists",
        });
        return;
      }
      let newUser = await userProfile.create({
        userId: targetUserId,
      });
      interaction.reply({
        content: "user added successfully",
      });
    } catch (err) {
      console.log(err);
    }
  },
  data: {
    name: "add-user",
    description: "add deputy to database",
    options: [
      {
        name: "target-user",
        description: "the user you want to add",
        type: ApplicationCommandOptionType.User,
      },
    ],
  },
};
