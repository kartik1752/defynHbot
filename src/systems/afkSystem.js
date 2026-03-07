// systems/afkSystem.js

const afkUsers = new Map(); // Store AFK users and their data

module.exports = {
    afkUsers,
    
    // Set a user as AFK
    setAFK: (member, message = "AFK", nickname = null) => {
        const userId = member.id;
        const guildId = member.guild.id;
        const uniqueId = `${guildId}-${userId}`;
        
        if (!afkUsers.has(uniqueId)) {
            afkUsers.set(uniqueId, {
                userId: userId,
                guildId: guildId,
                afk: true,
                message: message,
                timestamp: Date.now(),
                originalNickname: nickname || member.displayName,
                pingedBy: new Set()
            });
        } else {
            const userData = afkUsers.get(uniqueId);
            userData.afk = true;
            userData.message = message;
            userData.timestamp = Date.now();
            userData.pingedBy = new Set();
            afkUsers.set(uniqueId, userData);
        }
        
        return true;
    },
    
    // Remove AFK status
    removeAFK: (userId, guildId) => {
        const uniqueId = `${guildId}-${userId}`;
        
        if (afkUsers.has(uniqueId)) {
            const userData = afkUsers.get(uniqueId);
            afkUsers.delete(uniqueId);
            return userData;
        }
        return null;
    },
    
    // Check if user is AFK
    isAFK: (userId, guildId) => {
        const uniqueId = `${guildId}-${userId}`;
        return afkUsers.has(uniqueId);
    },
    
    // Get AFK data for a user
    getAFKData: (userId, guildId) => {
        const uniqueId = `${guildId}-${userId}`;
        return afkUsers.get(uniqueId) || null;
    },
    
    // Add a ping to an AFK user
    addPing: (userId, guildId, pingedBy) => {
        const uniqueId = `${guildId}-${userId}`;
        
        if (afkUsers.has(uniqueId)) {
            const userData = afkUsers.get(uniqueId);
            userData.pingedBy.add(pingedBy);
            afkUsers.set(uniqueId, userData);
            return true;
        }
        return false;
    },
    
    // Get all AFK users in a specific guild
    getGuildAFKUsers: (guildId) => {
        const guildAFKUsers = [];
        
        afkUsers.forEach((data, uniqueId) => {
            if (data.guildId === guildId) {
                guildAFKUsers.push({
                    ...data,
                    pingedBy: Array.from(data.pingedBy)
                });
            }
        });
        
        return guildAFKUsers;
    },
    
    // Get all AFK users
    getAllAFK: () => {
        const afkList = [];
        afkUsers.forEach((data, uniqueId) => {
            afkList.push({
                uniqueId,
                ...data,
                pingedBy: Array.from(data.pingedBy)
            });
        });
        return afkList;
    },
    
    // Get AFK count
    getAFKCount: () => {
        return afkUsers.size;
    },
    
    // Force remove AFK
    forceRemoveAFK: (userId, guildId) => {
        const uniqueId = `${guildId}-${userId}`;
        
        if (afkUsers.has(uniqueId)) {
            const userData = afkUsers.get(uniqueId);
            afkUsers.delete(uniqueId);
            return userData;
        }
        return null;
    }
};