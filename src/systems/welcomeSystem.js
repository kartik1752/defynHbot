const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const gifsPath = path.join(__dirname, "../data/welcome.json");

module.exports = async (member) => {

    const channel = member.guild.systemChannel;

    if (!channel) return;

    const gifs = JSON.parse(fs.readFileSync(gifsPath));

    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

    const embed = new EmbedBuilder()
        .setColor("#00ff99")
        .setTitle("🎉 New Member Joined!")
        .setDescription(`Welcome **${member.user.username}** to **${member.guild.name}**!`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setImage(randomGif)
        .setFooter({ text: `Member #${member.guild.memberCount}` });

    channel.send({ embeds: [embed] });

};