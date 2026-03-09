require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const spamDetector = require('./systems/spamDetector');
const raidDetector = require("./systems/raidDetector");
const messageFilter = require('./systems/messageFilter');
const afkSystem = require('./systems/afkSystem');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} is online!`);
    console.log(`📊 Current AFK users: ${afkSystem.getAFKCount()}`);
});


// 🚨 RAID DETECTION
client.on("guildMemberAdd", (member) => {
    raidDetector(member);
});


// 💬 MESSAGE SYSTEM
client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    const prefix = ".";

    // COMMAND SYSTEM
    if (message.content.startsWith(prefix)) {

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // AFK COMMAND
        if (command === "afk") {
            const afkCommand = require("./commands/afk");
            await afkCommand.execute(message, args);
            return;
        }

        // AVATAR COMMAND
        if (command === "av" || command === "avatar") {
            const avatarCommand = require("./commands/avatar");
            await avatarCommand.execute(message, args);
            return;
        }
        // WEATHER COMMAND
if (command === "weather" || command === "w") {
    const weatherCommand = require("./commands/weather");
    await weatherCommand.execute(message, args);
    return;
}
    }


    // 🔍 AFK MENTION CHECK
    if (message.guild && message.mentions.users.size > 0) {

        for (const [mentionedId, mentionedUser] of message.mentions.users) {

            if (afkSystem.isAFK(mentionedId, message.guild.id)) {

                const afkData = afkSystem.getAFKData(mentionedId, message.guild.id);
                afkSystem.addPing(mentionedId, message.guild.id, message.author.id);

                const timeAway = Date.now() - afkData.timestamp;
                const timeDisplay = formatTime(timeAway);

                await message.reply({
                    content: `💫 **${mentionedUser.username}** is AFK · ${timeDisplay}\n📝 *${afkData.message}*`,
                    allowedMentions: { repliedUser: false }
                });

            }
        }
    }


    // 🔍 AFK RETURN CHECK
    if (message.guild && afkSystem.isAFK(message.author.id, message.guild.id)) {

        const afkData = afkSystem.removeAFK(message.author.id, message.guild.id);

        const timeAway = Date.now() - afkData.timestamp;
        const timeDisplay = formatTime(timeAway);

        await message.reply({
            content: `👋 Welcome back, you were away for ${timeDisplay}`,
            allowedMentions: { repliedUser: false }
        });

    }


    await spamDetector(message);
    await messageFilter(message);

});


// ⏱ TIME FORMAT
function formatTime(ms) {

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;

}


// CLEAN AFK IF USER LEAVES
client.on('guildMemberRemove', (member) => {

    const removed = afkSystem.forceRemoveAFK(member.id, member.guild.id);

    if (removed) {
        console.log(`🧹 Cleaned AFK for ${member.user.tag}`);
    }

});


client.login(process.env.TOKEN);