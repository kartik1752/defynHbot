const axios = require("axios");

const getConfig = async (guildId) => {
  try {
    const res = await axios.get(
      `https://defyn-backend.onrender.com/config/${guildId}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Config fetch failed:", err.message);
    return null;
  }
};

module.exports = getConfig;
