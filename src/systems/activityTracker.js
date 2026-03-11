const axios = require("axios");

module.exports = async (message) => {

  if (message.author.bot) return;

  try {

    await axios.post("https://defyn-backend.onrender.com/activity", {
      guildId: message.guild.id,
      channelId: message.channel.id,
      userId: message.author.id
    });

  } catch (err) {
    console.log("Activity tracking failed");
  }

};