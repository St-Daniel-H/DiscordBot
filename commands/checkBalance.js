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
    const targetUserId =
      interaction.options.getUser("target-user")?.id || interaction.user.id;

    try {
      let user = await userProfile.findOne({ userId: targetUserId });
      if (!user) {
        interaction.reply({
          content: "No user was found",
        });
        return;
      }
      await interaction.deferReply();
      interaction.editReply(
        targetUserId === interaction.user.id
          ? "your total is, USD: " +
              user.USD +
              ", macro/boosting:" +
              user.MacroBoosting +
              ",Feedback:  " +
              user.Feedback +
              ".Total: " +
              parseInt(user.USD + user.MacroBoosting + user.Feedback)
          : "<@" +
              targetUserId +
              ">'s balance:  USD: " +
              user.USD +
              ", macro/boosting:" +
              user.MacroBoosting +
              ",Feedback:  " +
              user.Feedback +
              ".Total: " +
              parseInt(user.USD + user.MacroBoosting + user.Feedback)
      );
    } catch (err) {
      console.log(err);
    }
  },
  data: {
    name: "balance",
    description: "check deputy balance",
    options: [
      {
        name: "target-user",
        description: "the user you want to check balance",
        type: ApplicationCommandOptionType.User,
      },
    ],
  },
};
