const { addWarning } = require("./punishment");

const userMessages = new Map();

function clearUserCache(userId) {
    userMessages.delete(userId);
}

async function spamDetector(message) {

    const userId = message.author.id;

    if (!userMessages.has(userId)) {
        userMessages.set(userId, []);
    }

    const timestamps = userMessages.get(userId);
    const now = Date.now();

    timestamps.push(now);

    // last 6 seconds
    const filtered = timestamps.filter(time => now - time < 6000);

    userMessages.set(userId, filtered);

    if (filtered.length >= 7) {

        const warnings = addWarning(message.member);

        if (warnings <= 2) {

            message.channel.send(
                `⚠️ **${message.author}** ・Warning \`${warnings}/2\` for spam`
            );

        } else {

            await message.member.timeout(
                5 * 60 * 1000,
                "Spam detected"
            );

            message.channel.send(
                `🚫 **${message.author}** ・Timed out for 5 minutes (spam)`
            );

        }

        userMessages.delete(userId);
    }

}

module.exports = {
    spamDetector,
    clearUserCache
};