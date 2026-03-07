const { addWarning } = require("./punishment");

const userMessages = new Map();

module.exports = async (message) => {
    if (message.author.bot) return;

    const userId = message.author.id;

    if (!userMessages.has(userId)) {
        userMessages.set(userId, []);
    }

    const timestamps = userMessages.get(userId);
    const now = Date.now();

    timestamps.push(now);

    // ⏱️ Last 4 seconds
    const filtered = timestamps.filter(time => now - time < 4000);
    userMessages.set(userId, filtered);

    // 🚨 4 messages in 4 sec
    if (filtered.length >= 4) {
        const warnings = addWarning(message.member);

        // ✅ Only 2 warnings
        if (warnings <= 2) {
            message.channel.send(
                `⚠️ **${message.author}** ・Warning \`${warnings}/2\` for spam`
            );
        } else {
            await message.member.timeout(5 * 60 * 1000, "Spam detected");

            message.channel.send(
                `🚫 **${message.author}** ・Timed out for 5 minutes (spam)`
            );
        }

        userMessages.delete(userId);
    }
};
