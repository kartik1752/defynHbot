const { PermissionsBitField } = require("discord.js");

module.exports = {

  async warn(message, args) {

    // Permission check
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
      !message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)
    ) {
      return message.reply("❌ You don't have permission to warn members.");
    }

    const member = message.mentions.members.first();

    if (!member) {
      return message.reply("❌ Mention a user to warn.");
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    try {

      // DM the warned user
      await member.send(
        `⚠️ You have been warned in **${message.guild.name}**.\nReason: ${reason}`
      ).catch(() => {});

      message.reply(`⚠️ ${member.user.tag} has been warned.\nReason: ${reason}`);

    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to warn the user.");
    }

  }

};