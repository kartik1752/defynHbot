const { PermissionsBitField } = require("discord.js");

function parseTime(time) {
    const unit = time.slice(-1);
    const num = parseInt(time.slice(0, -1));

    if (isNaN(num)) return null;

    switch (unit) {
        case "s":
            return num * 1000;
        case "m":
            return num * 60 * 1000;
        case "h":
            return num * 60 * 60 * 1000;
        case "d":
            return num * 24 * 60 * 60 * 1000;
        default:
            return null;
    }
}

module.exports = {

    async mute(message, args) {

        // Permission check
        if (
            !message.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)
        ) {
            return message.reply("❌ You don't have permission to mute members.");
        }

        const member = message.mentions.members.first();
        const timeArg = args[1];

        if (!member) {
            return message.reply("❌ Mention a user to mute.");
        }

        if (!timeArg) {
            return message.reply("❌ Provide mute duration (example: 5m, 10m, 1h).");
        }

        const duration = parseTime(timeArg);

        if (!duration) {
            return message.reply("❌ Invalid time format. Use: s, m, h, d");
        }

        if (!member.moderatable) {
            return message.reply("❌ I can't mute this user.");
        }

        await member.timeout(duration, `Muted by ${message.author.tag}`);

        message.reply(
            `🔇 ${member.user.tag} has been muted for **${timeArg}**.`
        );
    },


    async unmute(message, args) {

        if (
            !message.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)
        ) {
            return message.reply("❌ You don't have permission to unmute members.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("❌ Mention a user to unmute.");
        }

        if (!member.moderatable) {
            return message.reply("❌ I can't unmute this user.");
        }

        await member.timeout(null);

        message.reply(`🔊 ${member.user.tag} has been unmuted.`);
    }

};