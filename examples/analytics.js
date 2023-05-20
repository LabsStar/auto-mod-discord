const { Client } = require("discord.js");
const { Analytics } = require("../src/app.js");


const client = new Client({
    intents: 32767,
});

const analytics = new Analytics();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
    if (message.content === "!analytics")  {
        analytics.sendEmbed(message.client, "1020761875979452457")
    }
});



client.login("TOKEN");