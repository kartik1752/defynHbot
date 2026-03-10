const { PermissionsBitField } = require("discord.js");

module.exports = {

  async ban(message, args) {

    // Permission check
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
      !message.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return message.reply("❌ You don't have permission to ban members.");
    }

    const member = message.mentions.members.first();

    if (!member) {
      return message.reply("❌ Mention a user to ban.");
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!member.bannable) {
      return message.reply("❌ I can't ban this user.");
    }
    if (member.id === message.author.id) {
  return message.reply("❌ You cannot ban yourself.");
}

if (member.id === message.guild.ownerId) {
  return message.reply("❌ You cannot ban the server owner.");
}

    try {

      // DM user before ban
      await member.send(
        `🚫 You have been banned from **${message.guild.name}**.\nReason: ${reason}`
      ).catch(() => {});

      await member.ban({ reason });

      message.reply(`🔨 ${member.user.tag} has been banned.\nReason: ${reason}`);

    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to ban the user.");
    }

  }

};