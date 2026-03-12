const axios = require("axios");

module.exports = async (message) => {

  if (message.author.bot) return;

  try {

    const res = await axios.post(
      "https://defyn-backend.onrender.com/activity",
      {
        guildId: message.guild.id,
        channelId: message.channel.id,
        userId: message.author.id
      },
      { timeout: 5000 }
    );

    console.log("Activity saved:", res.data);

  } catch (err) {

    console.log("Activity tracking failed");
    console.log("Error message:", err.message);

    if (err.response) {
      console.log("Response data:", err.response.data);
      console.log("Status:", err.response.status);
    }

  }

};