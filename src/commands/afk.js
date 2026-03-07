const { PermissionsBitField } = require('discord.js');
const afkSystem = require('../systems/afkSystem');

module.exports = {
    name: 'afk',
    description: 'Set yourself as AFK',
    usage: '.afk [message]',
    
    execute: async (message, args) => {
        const member = message.member;
        const userId = message.author.id;
        const guildId = message.guild.id;
        
        // Get AFK message from args or use default
        const afkMessage = args.join(' ') || 'AFK';
        
        // Check if message is too long (optional limit)
        if (afkMessage.length > 200) {
            return message.reply('❌ AFK message is too long! Please keep it under 200 characters.');
        }
        
        // Check if user is already AFK
        if (afkSystem.isAFK(userId, guildId)) {
            return message.reply('❌ You are already AFK! Send a message in any channel to remove your AFK status.');
        }
        
        // Set AFK status
        afkSystem.setAFK(member, afkMessage, member.displayName);
        
        // Optional: Change nickname to indicate AFK
        try {
            if (member.manageable) {
                await member.setNickname(`[AFK] ${member.displayName}`);
            }
        } catch (error) {
            console.log(`Could not change nickname for ${member.user.tag}`);
        }
        
        // Send confirmation
        await message.reply({
            content: `✅ **${message.author.username}** is now AFK\n📝 **Message:** ${afkMessage}\n⏰ I'll notify you when someone mentions you.\n💭 **Note:** Send any message to remove AFK status.`,
            allowedMentions: { repliedUser: false }
        });
    }
};