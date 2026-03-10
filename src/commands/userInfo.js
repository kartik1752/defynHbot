const { EmbedBuilder } = require("discord.js");

module.exports = {

  async execute(message, args) {

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    const user = member.user;

    const accountCreated = `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`;
    const joinedServer = `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`;

    const roles = member.roles.cache
      .filter(role => role.id !== message.guild.id)
      .map(role => role.toString())
      .join(", ") || "None";

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle(`👤 User Info`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .addFields(
        { name: "Username", value: `${user.tag}`, inline: true },
        { name: "User ID", value: `${user.id}`, inline: true },
        { name: "Account Created", value: accountCreated, inline: false },
        { name: "Joined Server", value: joinedServer, inline: false },
        { name: "Roles", value: roles, inline: false }
      )
      .setFooter({ text: `Requested by ${message.author.tag}` });

    message.reply({ embeds: [embed] });

  }

};