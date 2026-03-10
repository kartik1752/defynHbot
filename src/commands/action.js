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
        
        "https://i.pinimg.com/originals/2b/5d/7b/2b5d7bb1dd4a8e64869c33499c409582.gif",
        "https://i.pinimg.com/originals/8d/50/60/8d50607e59db86b5afcc21304194ba57.gif"
    ],

    kick: [
        
        "https://i.pinimg.com/originals/08/d5/91/08d59115f268d78f5375f7b13fe1cece.gif"
    ],

    hug: [
        
        "https://i.pinimg.com/originals/16/f4/ef/16f4ef8659534c88264670265e2a1626.gif",
        "https://i.pinimg.com/originals/ef/a9/1c/efa91c10e9ccd9acf601c693e46b00b0.gif"
    ],

    kiss: [
        
        "https://i.pinimg.com/originals/f0/3f/24/f03f245e14fdfcacaf06318cdc667a03.gif",
        "https://i.pinimg.com/originals/9c/be/bf/9cbebfb852e76c2b8d9c3b72ae08e68f.gif",
        "https://i.pinimg.com/originals/2e/e7/50/2ee750e5a53cd60c65604f591ff6e99f.gif"
    ],

    nutkick: [
        
        "https://r2.greed.best/nutkick/nutkick3.gif",
        "https://r2.greed.best/nutkick/nutkick2.gif",
        "https://r2.greed.best/nutkick/nutkick7.gif"
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