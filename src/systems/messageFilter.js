const { addWarning } = require("./punishment");
const config = require("../config.json");

const userCooldown = new Map(); // prevent spam warnings

function cleanText(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function detectCategory(content) {
    const clean = cleanText(content);

    for (const category in config.filter.categories) {
        const words = config.filter.categories[category];

        for (const word of words) {
            if (clean.includes(word)) {
                return category;
            }
        }
    }

    return null;
}

module.exports = async (message) => {
    if (!config.filter.enabled) return;
    if (message.author.bot) return;

    const userId = message.author.id;

    // ⏱️ Cooldown (2 sec)
    if (userCooldown.has(userId)) return;
    
    const category = detectCategory(message.content);

    if (!category) return;

    // ⛔ Delete bad message
    try {
        await message.delete();
    } catch {}

    const warnings = addWarning(message.member);

    if (warnings < config.filter.warnings) {
        message.channel.send(
            `⚠️ **${message.author}** ・Warning \`${warnings}/${config.filter.warnings}\`\nReason: **${category} language**`
        );
    } else {
        await message.member.timeout(
            config.filter.timeoutDuration,
            "Offensive language"
        );

        message.channel.send(
            `🚫 **${message.author}** ・Timed out for ${config.filter.timeoutDuration / 60000} minutes\n(Exceeded warnings)`
        );
    }

    // ⏱️ Set cooldown
    userCooldown.set(userId, true);
    setTimeout(() => userCooldown.delete(userId), 2000);
};
