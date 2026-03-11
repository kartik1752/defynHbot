const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = async function activityTracker(message) {

  try {

    await fetch("https://defyn-backend.onrender.com/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guildId: message.guild.id
      })
    });

  } catch (err) {

    console.error("Activity tracker error:", err.message);

  }

};