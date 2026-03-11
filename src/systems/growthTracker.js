const axios = require("axios");

module.exports = async (member) => {

  try {

    await axios.post("https://defyn-backend.onrender.com/growth", {
      guildId: member.guild.id
    });

  } catch (err) {

    console.log("Growth tracking failed");

  }

};