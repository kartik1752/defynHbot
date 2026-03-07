module.exports = {
  name: "messageCreate",

  async execute(message, client) {

    if (message.author.bot) return;

    const prefix = ".";

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // AFK command
    if (command === "afk") {
      const afkCommand = require("./commands/afk");
      await afkCommand.execute(message, args, client);
      return;
    }

    // Avatar command
    if (command === "av" || command === "avatar") {
      const avatarCommand = require("./commands/avatar");
      await avatarCommand.execute(message, args, client);
      return;
    }

  }
};