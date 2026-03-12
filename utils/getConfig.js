const axios = require("axios");

const cache = new Map();

const getConfig = async (guildId) => {
  try {

    const cached = cache.get(guildId);

    // ⏱ 5 second cache
    if (cached && Date.now() - cached.time < 5000) {
      return cached.data;
    }

    const res = await axios.get(
      `https://defyn-backend.onrender.com/config/${guildId}`
    );

    const data = res.data;

    cache.set(guildId, {
      data,
      time: Date.now()
    });

    return data;

  } catch (err) {

    console.error("❌ Config fetch failed:", err.message);

    return {
      antiSpam: false,
      antiRaid: false,
      aiMod: false
    };

  }
};

module.exports = getConfig;