const joinTimestamps = new Map();

let raidMode = false;

// ⚙️ CONFIG
const JOIN_WINDOW = 10000; // 10 sec
const JOIN_THRESHOLD = 5;
const NEW_ACCOUNT_DAYS = 3;
const NEW_ACCOUNT_RATIO = 0.6;
const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 min

module.exports = async (member) => {
    if (member.user.bot) return;

    const guildId = member.guild.id;

    if (!joinTimestamps.has(guildId)) {
        joinTimestamps.set(guildId, []);
    }

    const now = Date.now();
    const joins = joinTimestamps.get(guildId);

    joins.push({
        time: now,
        isNew: isNewAccount(member)
    });

    // Keep only last 10 sec
    const filtered = joins.filter(j => now - j.time < JOIN_WINDOW);
    joinTimestamps.set(guildId, filtered);

    // 🚨 If already in raid mode → punish instantly
    if (raidMode) {
        return handleRaidJoin(member);
    }

    const totalJoins = filtered.length;
    const newAccounts = filtered.filter(j => j.isNew).length;

    if (
        totalJoins >= JOIN_THRESHOLD &&
        (newAccounts / totalJoins) >= NEW_ACCOUNT_RATIO
    ) {
        triggerRaid(member.guild, totalJoins, newAccounts);
    }
};

// 🔍 Check account age
function isNewAccount(member) {
    const age = Date.now() - member.user.createdTimestamp;
    const days = age / (1000 * 60 * 60 * 24);
    return days < NEW_ACCOUNT_DAYS;
}

// 🚨 RAID MODE TRIGGER
function triggerRaid(guild, total, newCount) {
    raidMode = true;

    const channel =
        guild.systemChannel ||
        guild.channels.cache.find(c => c.isTextBased());

    if (channel) {
        channel.send(
            `🚨 **RAID DETECTED** 🚨\n` +
            `👥 Joins: ${total}\n` +
            `🆕 New Accounts: ${newCount}\n` +
            `🔒 Anti-raid enabled (auto-timeout active)`
        );
    }

    console.log(`[RAID] Detected in ${guild.name}`);

    // ⏳ Disable after 60 sec
    setTimeout(() => {
        raidMode = false;

        if (channel) {
            channel.send(`✅ Raid mode disabled.`);
        }
    }, 60000);
}

// 🛡️ HANDLE JOIN DURING RAID
async function handleRaidJoin(member) {
    try {
        // ❌ Skip admins
        if (member.permissions.has("Administrator")) return;

        // ❌ Optional: skip old accounts (safer)
        if (!isNewAccount(member)) return;

        await member.timeout(TIMEOUT_DURATION, "Raid protection");

        const channel =
            member.guild.systemChannel ||
            member.guild.channels.cache.find(c => c.isTextBased());

        if (channel) {
            channel.send(
                `🚫 **${member.user.tag}** auto-muted (raid protection)`
            );
        }

    } catch (err) {
        console.error("Raid timeout error:", err);
    }
}
