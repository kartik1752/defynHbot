const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/actions.json");

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const gifs = {
    punch: [
        "https://media.tenor.com/3V9J8YzS7W8AAAAC/anime-punch.gif"
    ],
    kick: [
        "https://media.tenor.com/Ws6DmK_8C1IAAAAC/anime-kick.gif"
    ],
    hug: [
        "https://media.tenor.com/qj5evVs-_uUAAAAC/anime-hug.gif"
    ],
    kiss: [
        "https://media.tenor.com/b7Z9V6H9bTQAAAAC/anime-kiss.gif"
    ],
    nutkick: [
        "https://media.tenor.com/QE8tTnT2R3sAAAAC/anime-funny-kick.gif"
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

        const gifList = gifs[command];
        const gif = gifList[Math.floor(Math.random() * gifList.length)];

        message.reply({
            content: `🔥 ${message.author} **${command}ed** ${target} for the **${getOrdinal(count)}** time!`,
            embeds: [{
                image: { url: gif }
            }]
        });

    }
};