require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const spamDetector = require('./systems/spamDetector');
const raidDetector = require("./systems/raidDetector");
const messageFilter = require('./systems/messageFilter');
const afkSystem = require('./systems/afkSystem'); // Import AFK system
const getConfig = require("../utils/getConfig");
const avatarCommand = require('./commands/avatar');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent // For reading mentions
    ]
});

client.on('clientReady', () => {
    console.log(`✅ ${client.user.tag} is online!`);
    console.log(`📊 Current AFK users: ${afkSystem.getAFKCount()}`);
    
    // ⚠️ REMOVED: auto-cleanup interval - AFK status never expires
});

// 🚨 RAID DETECTION
client.on("guildMemberAdd", (member) => {
    raidDetector(member);
});

// 💬 MESSAGE SYSTEMS
// ... (rest of your imports and code)

// 💬 MESSAGE SYSTEMS
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Check if the message is a command
    if (message.content.startsWith('.')) {
        const args = message.content.slice(1).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        
        // Handle AFK command
        if (command === 'afk') {
            const afkCommand = require('./commands/afk');
            await afkCommand.execute(message, args);
            return;
        }
    }

    // 🔍 AFK System - Check mentions
    if (message.guild && message.mentions.users.size > 0) {
        for (const [mentionedId, mentionedUser] of message.mentions.users) {
            if (afkSystem.isAFK(mentionedId, message.guild.id)) {
                const afkData = afkSystem.getAFKData(mentionedId, message.guild.id);
                afkSystem.addPing(mentionedId, message.guild.id, message.author.id);
                
                // Calculate time away
                const timeAway = Date.now() - afkData.timestamp;
                const timeDisplay = formatTime(timeAway);
                
                await message.reply({
                    content: `💫 **${mentionedUser.username}** is AFK · ${timeDisplay}\n📝 *${afkData.message}*`,
                    allowedMentions: { repliedUser: false }
                });
            }
        }
    }

    // 🔍 AFK System - Check if message author is returning from AFK
    if (message.guild && afkSystem.isAFK(message.author.id, message.guild.id)) {
        const afkData = afkSystem.removeAFK(message.author.id, message.guild.id);
        
        // Restore original nickname
        try {
            if (message.member.manageable && afkData.originalNickname) {
                await message.member.setNickname(afkData.originalNickname);
            }
        } catch (error) {
            console.log(`Could not restore nickname for ${message.author.tag}`);
        }
        
        // Calculate total time away
        const timeAway = Date.now() - afkData.timestamp;
        const timeDisplay = formatTime(timeAway);
        
        // Create ping summary
        const pingedBy = Array.from(afkData.pingedBy);
        let pingSummary = '';
        
        if (pingedBy.length > 0) {
            const pingedUsers = pingedBy.map(id => `<@${id}>`).join(' · ');
            pingSummary = `\n👋 ${pingedBy.length} mention${pingedBy.length > 1 ? 's' : ''} from: ${pingedUsers}`;
        }
        
        await message.reply({
            content: `👋 Welcome back, you were away for ${timeDisplay}${pingSummary}`,
            allowedMentions: { repliedUser: false }
        });
    }

    await spamDetector(message);
    await messageFilter(message);
});

// Helper function to format time
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

// ... (rest of your code)

// Optional: Handle guild member remove to clean up AFK status when they leave
client.on('guildMemberRemove', (member) => {
    const removed = afkSystem.forceRemoveAFK(member.id, member.guild.id);
    if (removed) {
        console.log(`🧹 Cleaned up AFK status for ${member.user.tag} (left server)`);
    }
});

client.login(process.env.TOKEN);