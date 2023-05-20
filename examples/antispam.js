const { Client } = require("discord.js");
const { AntiSpam } = require("../src/app.js");


const client = new Client({
    intents: 32767,
});

const antiSpam = new AntiSpam(client);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
    antiSpam.check(message, {
        warnMessage: "{@user}, Please do not spam {type}!",
        messageWarningThreshold: 5,
        emojiWarningThreshold: 5,
        modLogChannel: "1020761875979452457",
        bypassRoles: [],
        allowEmojis: false,
    });
});



client.login("TOKEN");