const axios = require("axios");

module.exports = {
    name: "weather",

    async execute(message, args) {

        if (!args.length) {
            return message.reply("❌ Please provide a city name.\nExample: `.weather Delhi`");
        }

        const city = args.join(" ");

        try {

            // get coordinates of city
            const geo = await axios.get(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
            );

            if (!geo.data.results) {
                return message.reply("❌ City not found.");
            }

            const { latitude, longitude, name, country } = geo.data.results[0];

            // get weather
            const weather = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );

            const temp = weather.data.current_weather.temperature;
            const wind = weather.data.current_weather.windspeed;

            message.reply(
                `🌤 **Weather in ${name}, ${country}**\n` +
                `🌡 Temperature: ${temp}°C\n` +
                `💨 Wind Speed: ${wind} km/h`
            );

        } catch (error) {
            message.reply("❌ Could not fetch weather.");
        }
    }
};