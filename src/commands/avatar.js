const { EmbedBuilder } = require("discord.js");

module.exports = {

    name: "av",

    async execute(message) {

        const user = message.mentions.users.first() || message.author;

        const avatarURL = user.displayAvatarURL({
            dynamic: true,
            size: 1024
        });

        const embed = new EmbedBuilder()
            .setColor("#00E5FF")
            .setTitle(`${user.username}'s Avatar`)
            .setImage(avatarURL);

        message.reply({ embeds: [embed] });

    }

};