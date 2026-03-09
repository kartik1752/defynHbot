const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const dataPath = path.join(__dirname, "../data/actions.json");

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const gifs = {

    punch: [
        
        "https://cdn.weeb.sh/images/SkKL3adPb.gif"
    ],

    kick: [
        
        "https://cdn.weeb.sh/images/rkXzjTXv-.gif"
    ],

    hug: [
        
        "https://cdn.weeb.sh/images/SJg2eTXvZ.gif"
    ],

    kiss: [
        
        "https://cdn.weeb.sh/images/SJ3e1amDZ.gif"
    ],

    nutkick: [
        
        "https://cdn.weeb.sh/images/Hy9XjTXv-.gif"
    ]

};

module.exports = {
    name: "action",

    async execute(message, args, command) {

        const target = message.mentions.users.first();

        if (!target) {
            return message.reply("❌ Mention a user.");
        }

        if (target.id === message.author.id) {
            return message.reply("❌ You can't use this on yourself.");
        }

        let data = {};

        if (fs.existsSync(dataPath)) {
            data = JSON.parse(fs.readFileSync(dataPath));
        }

        const key = `${command}_${message.author.id}_${target.id}`;

        data[key] = (data[key] || 0) + 1;

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        const count = data[key];

        const gifList = gifs[command] || [];
        const gif = gifList[Math.floor(Math.random() * gifList.length)];

        const embed = new EmbedBuilder()
            .setColor("#ff4d6d")
            .setImage(gif)
            .setFooter({ text: `${command.toUpperCase()} ACTION` });

        message.reply({
            content: `🔥 ${message.author} **${command}ed** ${target} for the **${getOrdinal(count)}** time!`,
            embeds: [embed]
        });

    }
};