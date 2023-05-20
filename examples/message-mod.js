const { Client } = require("discord.js");
const { AutoMod } = require("../src/app");


const client = new Client({
    intents: 32767,
});

const autoMod = new AutoMod(client, true);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
    autoMod.check(message, {
        deleteMessage: true,
        warnUser: true,
        modChannel: "1020761875979452457",
        pingMods: {
            role: "1010374856946233464",
        },
    });
});


client.login("TOKEN");