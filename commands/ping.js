module.exports = {
  data: {
    name: "ping",
    description: "replies with pong",
  },
  run: ({ interaction }) => {
    interaction.reply("pong");
  },
};
