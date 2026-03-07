// to get the list of all the afk users..
// commands/afk-list.js

const { PermissionsBitField } = require('discord.js');
const afkSystem = require('../systems/afkSystem');

module.exports = {
    name: 'afk-list',
    description: 'Show all AFK users in the server (Admin only)',
    usage: '.afk-list',
    
    execute: async (message, args) => {
        // Check if user has admin permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ You need administrator permissions to use this command.');
        }
        
        const guildAFKUsers = afkSystem.getGuildAFKUsers(message.guild.id);
        
        if (guildAFKUsers.length === 0) {
            return message.reply('📊 No users are currently AFK in this server.');
        }
        
        let afkList = '📋 **AFK Users in this server:**\n\n';
        
        guildAFKUsers.forEach((user, index) => {
            const member = message.guild.members.cache.get(user.userId);
            const username = member ? member.user.tag : 'Unknown User';
            const timeAgo = `<t:${Math.floor(user.timestamp / 1000)}:R>`;
            
            afkList += `${index + 1}. **${username}**\n`;
            afkList += `   📝 Message: ${user.message}\n`;
            afkList += `   ⏰ Since: ${timeAgo}\n`;
            afkList += `   👋 Pinged by: ${user.pingedBy.length} users\n\n`;
        });
        
        // Split if too long
        if (afkList.length > 2000) {
            return message.reply('📊 Too many AFK users to display in one message.');
        }
        
        await message.reply(afkList);
    }
};